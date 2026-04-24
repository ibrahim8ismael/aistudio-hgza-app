# Auth Rules & Conventions

## Overview
Authentication for Hgza uses NextAuth.js with OAuth providers (Google, Facebook).

---

## OAuth Providers

### Supported Providers
- **Google** — OAuth 2.0
- **Facebook** — OAuth 2.0

### No Password Auth
- No username/password login
- OAuth-only for fast MVP

---

## Session Management

### Provider
- Use NextAuth.js built-in session handling
- Store session in cookies (JWT)
- Default session strategy: JWT

### Session Data
```typescript
interface Session {
  user: {
    id: string          // from OAuth provider
    name: string        // from OAuth
    email: string       // from OAuth
    image?: string      // avatar from OAuth
    username?: string   // set after first login (required)
  }
}
```

---

## User Flow

### First Login (OAuth)
1. User clicks "Continue with Google/Facebook"
2. Redirected to OAuth provider
3. After approval, callback to `/api/auth/callback`
4. Check if user exists in database
   - **New user**: Redirect to username setup
   - **Existing user**: Create session, redirect to `/home`

### Username Setup (First Login Only)
- Required after first OAuth login
- Username must be unique
- Store username in user record
- After setup, redirect to `/home`

### Returning Users
- OAuth login → Validate session → Redirect to `/home`

---

## Protected Routes

### Public Routes
- `/` — Landing page
- `/signin` — Sign-in page

### Protected Routes (Require Auth)
- `/home` — Dashboard
- `/groups` — Group management
- `/round` — Round management
- `/leaderboard` — Rankings

### Middleware
- Use NextAuth middleware to protect routes
- Redirect unauthenticated users to `/signin`

---

## API Routes

### Auth Routes
- `GET /api/auth/signin` — NextAuth sign-in page
- `GET /api/auth/signout` — Sign out
- `GET /api/auth/callback/[provider]` — OAuth callback
- `POST /api/auth/_rotation` — Session refresh

### Custom Routes
- `POST /api/auth/username` — Set username (first login only)

---

## Database Schema (Future)

### User Collection
```typescript
interface User {
  id: string             // OAuth provider ID
  email: string          // from OAuth
  name: string           // from OAuth
  username?: string      // unique, set after signup
  image?: string         // avatar URL
  provider: 'google' | 'facebook'
  createdAt: Date
  updatedAt: Date
}
```

---

## Security Rules

1. **No password storage** — OAuth only
2. **CSRF protection** — Built into NextAuth
3. **Session expiry** — 30 days (configurable)
4. **Username uniqueness** — Validate before save
5. **OAuth redirect URIs** — Must match configured URLs

---

## Error Handling

### Auth Errors
- Invalid OAuth credentials → Show error on signin
- User denied permission → Redirect to signin with message
- Session expired → Redirect to signin
- Username taken → Show error on setup page

---

## Development Notes

- Use `NEXTAUTH_SECRET` for JWT encryption
- Use `NEXTAUTH_URL` for production URLs
- Store OAuth credentials in environment variables
- Test OAuth flow locally with redirect URIs

---

## NextAuth Configuration (Example)

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

## Related Files

- `.opencode/plans/signin-page.md` — Implementation plan
- `src/app/signin/page.tsx` — Sign-in page component
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler (future)