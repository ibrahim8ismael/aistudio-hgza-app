# HGZA App — Technical Architecture & Stack Document

## 1. Tech Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router) | React framework with SSR/SSG, API routes, and server components |
| **Backend API** | tRPC | End-to-end typesafe APIs with zero schema duplication |
| **Database** | MongoDB Atlas | NoSQL document store for flexible group/round/team data |
| **Auth** | NextAuth.js (Auth.js v5) | OAuth providers (Google, Discord, etc.) + JWT sessions |
| **ORM/Client** | Mongoose | MongoDB object modeling and schema validation |
| **State Management** | Zustand + TanStack Query (React Query) | Client state + server state caching |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first styling + accessible UI primitives |
| **Validation** | Zod | Runtime schema validation shared between client and server |
| **Deployment** | Vercel | Edge-ready hosting for Next.js |

---

## 2. Database Schema (MongoDB + Mongoose)

MongoDB is chosen for its flexible document structure, which maps naturally to the nested group/round/team hierarchy.

### 2.1 Collections Overview

```
users
├── groups[] (embedded refs)
└── profile (name, avatar, email)

groups
├── admin_id (ref: users)
├── members[] (embedded: user_id, joined_at, is_active)
├── rounds[] (embedded subdocuments)
├── settings (squad_size, invite_code)
└── timestamps

rounds (embedded in groups, or separate collection)
├── group_id
├── name / number
├── start_at (Date, immutable)
├── end_at (Date, mutable by admin)
├── transfer_limit (Number)
├── state (enum: UPCOMING | LIVE | ENDED | PENDING_SCORING | COMPLETED)
├── points_records[] (user_id, raw_score, card_status)
├── teams[] (user_id, squad[], captain_id, vice_captain_id, transfer_count)
├── calculated_scores[] (user_id, final_score, breakdown)
└── timestamps

invites
├── group_id
├── code (unique, short)
├── created_by
├── expires_at
├── max_uses
└── used_by[]
```

### 2.2 Detailed Schemas

#### User
```typescript
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  accounts: [{ provider: String, providerAccountId: String }], // NextAuth managed
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  createdAt: { type: Date, default: Date.now },
});
```

#### Group
```typescript
const MemberEmbedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const GroupSchema = new Schema({
  name: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [MemberEmbedSchema],           // Pool Members = all members
  inviteCode: { type: String, unique: true, sparse: true },
  settings: {
    squadSize: { type: Number, default: 5 },
  },
}, { timestamps: true });
```

#### Round (Embedded in Group or Separate Collection)

> **Recommendation**: Embed rounds in `Group` if < 100 rounds/group. Use separate collection if groups run indefinitely.

```typescript
const PointsRecordSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rawScore: { type: Number, default: 0 },
  cardStatus: { type: String, enum: ['none', 'yellow', 'red'], default: 'none' },
}, { _id: false });

const TeamSlotSchema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rawScore: { type: Number, default: 0 },       // denormalized after scoring
  multiplier: { type: Number, default: 1.0 },   // 2.0 | 1.5 | 1.0
  cardPenalty: { type: Number, default: 0 },    // 0 | -1 | -3
  slotScore: { type: Number, default: 0 },      // calculated
}, { _id: false });

const TeamSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  squad: [TeamSlotSchema],
  captain: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  viceCaptain: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transferCount: { type: Number, default: 0 },
  transferPenalty: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
  isAutoCarried: { type: Boolean, default: false },
}, { _id: false });

const RoundSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  name: { type: String, required: true },
  startAt: { type: Date, required: true },      // IMMUTABLE
  endAt: { type: Date, required: true },        // mutable by admin during LIVE
  transferLimit: { type: Number, default: 1 },
  state: { 
    type: String, 
    enum: ['UPCOMING', 'LIVE', 'ENDED', 'PENDING_SCORING', 'COMPLETED'],
    default: 'UPCOMING'
  },
  pointsRecords: [PointsRecordSchema],          // admin fills this post-round
  teams: [TeamSchema],                          // one per member
  completedAt: { type: Date },
}, { timestamps: true });
```

#### Invite
```typescript
const InviteSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  code: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date },
  maxUses: { type: Number, default: 1 },
  usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
```

### 2.3 Indexing Strategy

```javascript
// Groups
db.groups.createIndex({ admin: 1 });
db.groups.createIndex({ 'members.user': 1 });
db.groups.createIndex({ inviteCode: 1 });

// Rounds (if separate collection)
db.rounds.createIndex({ group: 1, state: 1 });
db.rounds.createIndex({ group: 1, startAt: -1 });
db.rounds.createIndex({ state: 1, endAt: 1 });  // for cron jobs

// Invites
db.invites.createIndex({ code: 1 });
db.invites.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## 3. Authentication (NextAuth.js v5 / Auth.js)

### 3.1 Configuration

```typescript
// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
```

### 3.2 Middleware (Route Protection)

```typescript
// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login"].includes(nextUrl.pathname);

  if (isApiAuthRoute) return NextResponse.next();
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 4. tRPC Architecture

### 4.1 Router Structure

```
server/
├── trpc.ts              // Context, middleware, procedure builders
├── routers/
│   ├── _app.ts          // Main router merger
│   ├── auth.ts          // Session & user profile
│   ├── group.ts         // Group CRUD + invites
│   ├── round.ts         // Round lifecycle + scoring
│   ├── team.ts          // Team building & transfers
│   └── leaderboard.ts   // Rankings & stats
```

### 4.2 Context & Middleware

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/auth";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  const session = await auth();
  return { session, userId: session?.user?.id };
});

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Enforce authentication
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, userId: ctx.session.user.id } });
});

// Enforce group membership
export const memberProcedure = authedProcedure
  .input(z.object({ groupId: z.string() }))
  .use(async ({ ctx, input, next }) => {
    const group = await Group.findById(input.groupId);
    if (!group) throw new TRPCError({ code: "NOT_FOUND" });
    const isMember = group.members.some(m => m.user.toString() === ctx.userId);
    if (!isMember) throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx: { ...ctx, group } });
  });

// Enforce group admin
export const adminProcedure = memberProcedure.use(async ({ ctx, next }) => {
  if (ctx.group.admin.toString() !== ctx.userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
  return next({ ctx });
});
```

### 4.3 Key Procedures

#### Group Router
```typescript
export const groupRouter = router({
  create: authedProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const group = await Group.create({
        name: input.name,
        admin: ctx.userId,
        members: [{ user: ctx.userId }],
        inviteCode: generateShortCode(),
      });
      return group;
    }),

  join: authedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await Invite.findOne({ code: input.code });
      if (!invite || invite.isExpired()) throw new TRPCError({ code: "BAD_REQUEST" });

      const group = await Group.findById(invite.group);
      const alreadyMember = group.members.some(m => m.user.toString() === ctx.userId);
      if (alreadyMember) throw new TRPCError({ code: "CONFLICT", message: "Already in group" });

      group.members.push({ user: ctx.userId });
      await group.save();

      invite.usedBy.push(ctx.userId);
      await invite.save();

      return group;
    }),

  myGroups: authedProcedure.query(async ({ ctx }) => {
    return Group.find({ 'members.user': ctx.userId }).populate('admin', 'name image');
  }),
});
```

#### Round Router
```typescript
export const roundRouter = router({
  create: adminProcedure
    .input(z.object({
      groupId: z.string(),
      name: z.string(),
      startAt: z.coerce.date(),
      endAt: z.coerce.date(),
      transferLimit: z.number().min(0).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Prevent overlapping rounds
      const overlapping = await Round.findOne({
        group: input.groupId,
        state: { $in: ['UPCOMING', 'LIVE'] },
      });
      if (overlapping) throw new TRPCError({ code: "CONFLICT", message: "Active round exists" });

      const round = await Round.create({
        group: input.groupId,
        name: input.name,
        startAt: input.startAt,
        endAt: input.endAt,
        transferLimit: input.transferLimit,
        state: 'UPCOMING',
      });
      return round;
    }),

  updateEndAt: adminProcedure
    .input(z.object({ groupId: z.string(), roundId: z.string(), endAt: z.coerce.date() }))
    .mutation(async ({ input }) => {
      const round = await Round.findOne({ _id: input.roundId, group: input.groupId });
      if (!round || round.state !== 'LIVE') {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Can only extend LIVE rounds" });
      }
      round.endAt = input.endAt;
      await round.save();
      return round;
    }),

  submitScores: adminProcedure
    .input(z.object({
      groupId: z.string(),
      roundId: z.string(),
      scores: z.array(z.object({
        userId: z.string(),
        rawScore: z.number(),
        cardStatus: z.enum(['none', 'yellow', 'red']).default('none'),
      })),
    }))
    .mutation(async ({ input }) => {
      const round = await Round.findOne({ _id: input.roundId, group: input.groupId });
      if (!round || round.state !== 'PENDING_SCORING') {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Round not ready for scoring" });
      }

      // Validate all members have scores
      const group = await Group.findById(input.groupId);
      const allMemberIds = group.members.map(m => m.user.toString());
      const scoredIds = input.scores.map(s => s.userId);
      const missing = allMemberIds.filter(id => !scoredIds.includes(id));
      if (missing.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Missing scores for ${missing.length} members` });
      }

      round.pointsRecords = input.scores;

      // Trigger calculation
      await calculateRoundScores(round);

      round.state = 'COMPLETED';
      round.completedAt = new Date();
      await round.save();

      return round;
    }),

  getByGroup: memberProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input }) => {
      return Round.find({ group: input.groupId }).sort({ startAt: -1 });
    }),
});
```

#### Team Router
```typescript
export const teamRouter = router({
  save: memberProcedure
    .input(z.object({
      groupId: z.string(),
      roundId: z.string(),
      squad: z.array(z.string()).min(1),       // user IDs
      captain: z.string(),
      viceCaptain: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const round = await Round.findOne({ _id: input.roundId, group: input.groupId });
      if (!round || round.state !== 'UPCOMING') {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Round is locked" });
      }

      // Validate squad members are in group
      const group = await Group.findById(input.groupId);
      const poolIds = group.members.map(m => m.user.toString());
      const allValid = input.squad.every(id => poolIds.includes(id));
      if (!allValid) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid squad members" });

      // Validate captain/vice are in squad
      if (!input.squad.includes(input.captain) || !input.squad.includes(input.viceCaptain)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Captain/Vice must be in squad" });
      }

      // Calculate transfers
      const prevRound = await Round.findOne({
        group: input.groupId,
        startAt: { $lt: round.startAt },
        state: 'COMPLETED',
      }).sort({ startAt: -1 });

      let transferCount = 0;
      if (prevRound) {
        const prevTeam = prevRound.teams.find(t => t.owner.toString() === ctx.userId);
        if (prevTeam) {
          const prevSquad = prevTeam.squad.map(s => s.player.toString());
          const changes = input.squad.filter(id => !prevSquad.includes(id)).length;
          transferCount = changes;
        } else {
          transferCount = input.squad.length; // new member = full rebuild
        }
      }

      const transferPenalty = Math.max(0, transferCount - round.transferLimit) * 5;

      // Upsert team
      const existingIdx = round.teams.findIndex(t => t.owner.toString() === ctx.userId);
      const teamData = {
        owner: ctx.userId,
        squad: input.squad.map(id => ({ player: id, multiplier: 1.0 })),
        captain: input.captain,
        viceCaptain: input.viceCaptain,
        transferCount,
        transferPenalty,
        isAutoCarried: false,
      };

      if (existingIdx >= 0) {
        round.teams[existingIdx] = teamData;
      } else {
        round.teams.push(teamData);
      }

      await round.save();
      return teamData;
    }),

  getMyTeam: memberProcedure
    .input(z.object({ groupId: z.string(), roundId: z.string() }))
    .query(async ({ ctx, input }) => {
      const round = await Round.findById(input.roundId);
      const team = round.teams.find(t => t.owner.toString() === ctx.userId);
      return team || null;
    }),
});
```

#### Leaderboard Router
```typescript
export const leaderboardRouter = router({
  weekly: memberProcedure
    .input(z.object({ groupId: z.string(), roundId: z.string() }))
    .query(async ({ input }) => {
      const round = await Round.findById(input.roundId)
        .populate('teams.owner', 'name image')
        .populate('teams.squad.player', 'name image');

      if (!round || round.state !== 'COMPLETED') {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Round not completed" });
      }

      const rankings = round.teams
        .map(t => ({
          user: t.owner,
          finalScore: t.finalScore,
          transferPenalty: t.transferPenalty,
        }))
        .sort((a, b) => b.finalScore - a.finalScore);

      return rankings;
    }),

  allTime: memberProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input }) => {
      const results = await Round.aggregate([
        { $match: { group: new ObjectId(input.groupId), state: 'COMPLETED' } },
        { $unwind: '$teams' },
        {
          $group: {
            _id: '$teams.owner',
            totalScore: { $sum: '$teams.finalScore' },
            roundsPlayed: { $sum: 1 },
            avgScore: { $avg: '$teams.finalScore' },
          },
        },
        { $sort: { totalScore: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
      ]);

      return results;
    }),
});
```

---

## 5. Score Calculation Engine

```typescript
// lib/scoring.ts
export async function calculateRoundScores(round: RoundDoc) {
  const cardMap = new Map(round.pointsRecords.map(pr => [pr.user.toString(), pr]));

  for (const team of round.teams) {
    let baseScore = 0;

    for (const slot of team.squad) {
      const record = cardMap.get(slot.player.toString());
      const rawScore = record?.rawScore ?? 0;
      const cardStatus = record?.cardStatus ?? 'none';

      // Determine multiplier
      let multiplier = 1.0;
      if (slot.player.toString() === team.captain.toString()) multiplier = 2.0;
      else if (slot.player.toString() === team.viceCaptain.toString()) multiplier = 1.5;

      // Card penalty
      let cardPenalty = 0;
      if (cardStatus === 'yellow') cardPenalty = 1;
      if (cardStatus === 'red') cardPenalty = 3;

      const slotScore = (rawScore * multiplier) - cardPenalty;

      // Denormalize for quick reads
      slot.rawScore = rawScore;
      slot.multiplier = multiplier;
      slot.cardPenalty = cardPenalty;
      slot.slotScore = slotScore;

      baseScore += slotScore;
    }

    team.finalScore = baseScore - team.transferPenalty;
  }

  await round.save();
}
```

---

## 6. Round State Machine & Cron Jobs

### 6.1 State Transition Service

```typescript
// lib/round-state-machine.ts
export async function processRoundTransitions() {
  const now = new Date();

  // UPCOMING → LIVE
  await Round.updateMany(
    { state: 'UPCOMING', startAt: { $lte: now } },
    { $set: { state: 'LIVE' } }
  );

  // LIVE → ENDED
  await Round.updateMany(
    { state: 'LIVE', endAt: { $lte: now } },
    { $set: { state: 'ENDED' } }
  );

  // ENDED → PENDING_SCORING (immediate)
  await Round.updateMany(
    { state: 'ENDED' },
    { $set: { state: 'PENDING_SCORING' } }
  );

  // Auto-carry teams for members who didn't submit
  await autoCarryTeams();
}

async function autoCarryTeams() {
  const rounds = await Round.find({ state: 'LIVE' });

  for (const round of rounds) {
    const group = await Group.findById(round.group);
    const memberIds = group.members.map(m => m.user.toString());
    const submittedIds = round.teams.map(t => t.owner.toString());
    const missingIds = memberIds.filter(id => !submittedIds.includes(id));

    if (missingIds.length === 0) continue;

    // Find previous completed round
    const prevRound = await Round.findOne({
      group: round.group,
      state: 'COMPLETED',
      startAt: { $lt: round.startAt },
    }).sort({ startAt: -1 });

    for (const userId of missingIds) {
      if (prevRound) {
        const prevTeam = prevRound.teams.find(t => t.owner.toString() === userId);
        if (prevTeam) {
          round.teams.push({
            owner: userId,
            squad: prevTeam.squad.map(s => ({ player: s.player, multiplier: 1.0 })),
            captain: prevTeam.captain,
            viceCaptain: prevTeam.viceCaptain,
            transferCount: prevTeam.squad.length, // full squad change = all transfers
            transferPenalty: Math.max(0, prevTeam.squad.length - round.transferLimit) * 5,
            isAutoCarried: true,
            finalScore: 0,
          });
        }
      }
      // If no prevRound, they score 0 (no team pushed)
    }

    await round.save();
  }
}
```

### 6.2 Cron Setup (Vercel Cron)

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/round-transitions",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

```typescript
// app/api/cron/round-transitions/route.ts
import { NextResponse } from "next/server";
import { processRoundTransitions } from "@/lib/round-state-machine";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await processRoundTransitions();
  return NextResponse.json({ success: true });
}
```

---

## 7. Frontend Architecture (Next.js App Router)

### 7.1 Route Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── layout.tsx              // Sidebar + auth check
│   ├── page.tsx                // My Groups list
│   ├── group/
│   │   └── [groupId]/
│   │       ├── page.tsx        // Group home / current round
│   │       ├── rounds/
│   │       │   └── [roundId]/
│   │       │       ├── page.tsx        // Round detail + team builder
│   │       │       └── results/page.tsx // Post-round summary
│   │       ├── leaderboard/
│   │       │   ├── weekly/page.tsx
│   │       │   └── all-time/page.tsx
│   │       └── admin/
│   │           ├── rounds/page.tsx      // Round management
│   │           ├── score/[roundId]/page.tsx // Scoring panel
│   │           └── settings/page.tsx
│   └── invite/
│       └── [code]/page.tsx     // Join group via invite
├── api/
│   ├── trpc/[trpc]/route.ts    // tRPC handler
│   ├── auth/[...nextauth]/route.ts
│   └── cron/round-transitions/route.ts
```

### 7.2 tRPC Client Setup

```typescript
// lib/trpc/client.ts
import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

// providers.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      async headers() {
        return {};
      },
    }),
  ],
});
```

### 7.3 Server Components Pattern

```typescript
// app/(dashboard)/group/[groupId]/page.tsx
import { api } from "@/lib/trpc/server";
import { RoundStatus } from "@/components/round-status";
import { TeamBuilder } from "@/components/team-builder";

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  const group = await api.group.getById({ groupId: params.groupId });
  const currentRound = await api.round.getCurrent({ groupId: params.groupId });

  return (
    <div>
      <h1>{group.name}</h1>
      {currentRound && (
        <>
          <RoundStatus round={currentRound} />
          {currentRound.state === "UPCOMING" && (
            <TeamBuilder groupId={params.groupId} roundId={currentRound._id} />
          )}
        </>
      )}
    </div>
  );
}
```

---

## 8. Real-Time Considerations

| Feature | Approach |
|---------|----------|
| **Round countdown** | Client-side `setInterval` with server-synced `startAt`/`endAt` |
| **State transitions** | Cron job every 5 minutes + optimistic UI updates |
| **Admin scoring updates** | tRPC query invalidation (`utils.round.getByGroup.invalidate()`) |
| **Live leaderboard** | Not needed (results published after scoring). Use SSR for completed rounds. |
| **Notifications** | Optional: Push via web push API when round completes or results ready |

---

## 9. Security Checklist

| Concern | Mitigation |
|---------|-----------|
| **Admin-only actions** | `adminProcedure` middleware enforces ownership at every tRPC call |
| **Round lock bypass** | State checked server-side; never trust client timestamps |
| **Invite code abuse** | Short codes with expiry, max uses, and usage tracking |
| **Team injection** | Validate all `squad` IDs exist in group's member pool |
| **Score tampering** | Admin submits all scores atomically; no partial updates allowed |
| **MongoDB injection** | Mongoose sanitizes queries; Zod validates all inputs |
| **Cron endpoint** | Protected by `CRON_SECRET` header |

---

## 10. Deployment & Environment

### 10.1 Required Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hgza?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=https://hgza.vercel.app
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...

# Cron
CRON_SECRET=your-cron-secret
```

### 10.2 Vercel Config

```json
{
  "buildCommand": "next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/cron/round-transitions",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### 10.3 MongoDB Atlas Notes
- Use **M10+ cluster** for production (free tier M0 has connection limits).
- Enable **Database Access** IP allowlist or use VPC peering.
- Configure **auto-scaling** for storage.
- Set up **backups** (Atlas provides continuous backups for M10+).

---

## 11. Development Workflow

```bash
# 1. Clone & install
git clone <repo>
cd hgza
npm install

# 2. Setup env
cp .env.example .env.local
# Fill in MongoDB URI + OAuth credentials

# 3. Run dev server
npm run dev

# 4. Database seeding (optional)
npx tsx scripts/seed.ts

# 5. Build & deploy
npm run build
vercel --prod
```

---

## 12. Summary

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Server components for data fetching, API routes for tRPC, unified codebase |
| **tRPC** | End-to-end type safety between frontend and backend; no REST boilerplate |
| **MongoDB Atlas** | Flexible schema fits nested round/team data; easy horizontal scaling |
| **NextAuth.js** | Handles OAuth flows, session management, and JWT tokens out of the box |
| **Mongoose** | Schema validation, middleware hooks, and MongoDB abstraction |
| **Vercel Cron** | Simple, serverless scheduling for round state transitions |
| **Zod** | Shared validation schemas between tRPC inputs and forms |
