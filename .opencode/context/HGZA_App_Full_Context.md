# HGZA App — Full Product Logic & Context Document

## 1. Overview
**HGZA** is a private, web-based fantasy league platform where the "players" are the friends themselves within a closed group. There are no real-world sports teams or athletes involved. A **Group Admin** creates a league, invites friends, creates rounds, and manually assigns performance points to every group member after each round. All other members build fantasy teams by drafting their friends, applying multipliers, and competing on leaderboards.

---

## 2. User Roles & Permissions

### 2.1 Admin (Group Creator)
- Creates the group and configures its settings.
- Invites members via invite links/codes (only the admin can invite).
- Creates rounds: sets `start_at` (immutable after creation), `end_at` (editable while round is active), and transfer limit.
- Manually assigns raw points to **every** group member after a round ends.
- Cannot leave the group or transfer admin rights (single owner model).
- Views all group data, leaderboards, and member teams.

### 2.2 Member (Regular Player)
- Joins exclusively via admin invitation.
- Builds and edits their fantasy team before the round lock.
- Selects a Captain and Vice-Captain from their squad.
- Makes transfers within the allowed limit.
- Views their own team, post-round breakdowns, and leaderboards.
- **Cannot leave the group once joined** (permanent membership).

### 2.3 System
- Enforces time-based locks automatically.
- Calculates final scores, multipliers, penalties, and rankings.
- Auto-carries over the previous round's team if a member fails to set one.
- Updates leaderboards only after a round is fully scored.

---

## 3. Core Entities

| Entity | Definition |
|--------|------------|
| **User** | Platform account. One user can be a member of multiple groups. |
| **Group** | A private, isolated league with exactly one admin and multiple permanent members. |
| **Round** | A scoring period created by the admin with a start time, end time, and transfer limit. |
| **Pool Member** | Every friend inside a group. Each is a draftable "player" with no price tag. |
| **Fantasy Team** | A member's selected squad of Pool Members for a specific round. |
| **Points Record** | The raw score assigned by the admin to a Pool Member for a specific round. |
| **Calculated Score** | The final fantasy points after applying multipliers, card penalties, and transfer penalties. |
| **Leaderboard Entry** | A member's standing based on either a single round or cumulative all-time score. |

---

## 4. Group Lifecycle

1. **Creation**: Admin creates a Group, names it, and receives an invite mechanism.
2. **Invitation**: Admin invites friends. Only the admin can issue invitations.
3. **Joining**: Users accept invites and become permanent Pool Members of that Group.
4. **Immortality**: Once joined, a member **cannot leave** the group. They remain in the pool indefinitely.
5. **Rounds**: The admin creates sequential or ad-hoc rounds (daily or weekly).

---

## 5. Round Lifecycle & States

A Round moves through strict states managed by time and admin action.

### 5.1 States

| State | Description |
|-------|-------------|
| `UPCOMING` | Round created. `start_at` is in the future. Team editing is open. |
| `LIVE` | Current time is between `start_at` and `end_at`. Teams are **locked**. No edits allowed. |
| `ENDED` | Current time has passed `end_at`. Teams remain locked. Admin must now enter scores. |
| `PENDING_SCORING` | Round has ended but the admin has not yet submitted points for all members. Results are hidden. |
| `COMPLETED` | Admin has submitted all points. System calculates final scores. Leaderboards update. Results visible to all. |

### 5.2 State Transitions

```
UPCOMING → LIVE (automatic at start_at)
LIVE → ENDED (automatic at end_at)
ENDED → PENDING_SCORING (automatic)
PENDING_SCORING → COMPLETED (manual admin action)
COMPLETED → (next round UPCOMING, created by admin)
```

### 5.3 Round Configuration Rules
- **Start Date (`start_at`)**: Set at creation. **Immutable.** Once a round has a start time, the admin cannot change it.
- **End Date (`end_at`)**: Set at creation. **Editable by admin while the round is in `LIVE` state.** The admin can extend or shorten the active period.
- **Transfer Limit**: Admin sets the number of free transfers allowed for that round (e.g., 0, 1, 2).
- **Duration Flexibility**: Admin can create rounds daily, weekly, or any custom duration.

---

## 6. Team Management

### 6.1 Squad Composition
- Each member drafts a team consisting of other friends from the group's pool.
- **No pricing system exists.** There is no budget. Any friend can be picked (including themselves, if the group allows it — *to be decided by product*).
- Squad size is fixed (e.g., 5, 7, or 11 members — *configurable per group*).

### 6.2 Captain & Vice-Captain
- Each team must designate **one Captain** and **one Vice-Captain**.
- **Captain**: Raw points × **2.0**
- **Vice-Captain**: Raw points × **1.5**
- All other squad members: Raw points × **1.0**

### 6.3 Editing Window
- Teams can be edited **only during the `UPCOMING` state** (before `start_at`).
- Once the round hits `start_at`, all teams are **automatically locked**.
- Members cannot change captain, vice-captain, or squad during `LIVE` or `ENDED`/`PENDING_SCORING`.

### 6.4 Auto-Carryover Rule
- If a member does **not** actively set or edit their team before the lock, the system **automatically submits their previous round's team**.
- This includes the exact same squad, captain, and vice-captain selections.
- If it is the very first round and they have no prior team, they score **zero**.

---

## 7. Scoring System

### 7.1 Raw Points
- After a round ends, the admin opens the scoring panel.
- The admin manually inputs a **raw score** for **every** Pool Member (every friend in the group).
- There is no automation; the admin decides the points based on whatever criteria the group agrees upon (challenges, activities, votes, etc.).

### 7.2 Card Penalties (Per Player Slot)
The admin can assign disciplinary flags to any Pool Member when entering scores:
- **Yellow Card**: −1 point to that specific slot
- **Red Card**: −3 points to that specific slot

*Example*: If your Captain receives a Red Card, their slot score is `(Raw × 2.0) − 3`.

### 7.3 Transfer Penalties (Per Team)
- Each round has a **Free Transfer Limit** (e.g., 1 free transfer).
- A transfer is defined as any squad change (swapping one Pool Member for another).
- **Within limit**: No penalty.
- **Extra transfers**: Each transfer beyond the limit costs **−5 points** from the member's **total round score**.
- The system counts how many changes were made compared to the previous round's locked team.

### 7.4 Final Score Formula

```
For each slot in the team:
  Slot Score = (Raw Points × Multiplier) − Card Penalty

Team Base Score = Sum of all Slot Scores

Transfer Penalty = (Number of Transfers Made − Free Transfer Limit) × 5
  [If result is negative or zero, penalty = 0]

Final Round Score = Team Base Score − Transfer Penalty
```

### 7.5 Post-Round Summary
Once a round reaches `COMPLETED`, every member sees:
- **Your Score**: Your final calculated score.
- **Top Score**: The highest final score achieved by any member in the group that round.
- **Average Score**: The arithmetic mean of all members' final scores.
- **Breakdown**: A per-slot table showing:
  - Selected Pool Member
  - Raw Points (as set by admin)
  - Multiplier applied (Captain / Vice / None)
  - Card penalties (if any)
  - Final slot score
- **Transfer Log**: Number of free transfers used, extra transfers made, and total transfer penalty.

---

## 8. Transfer System

### 8.1 Free Transfers
- The admin defines how many free transfers are allowed per round.
- Typical values: 0, 1, or 2.
- Free transfers do not roll over to the next round (use them or lose them).

### 8.2 Extra Transfers
- Members may make additional transfers beyond the free limit.
- Each extra transfer incurs a **−5 point penalty** on the total round score.
- There is no hard cap on extra transfers (a member can theoretically rebuild their entire team at a heavy cost).

### 8.3 Transfer Timing
- Transfers are allowed **only while the round is in `UPCOMING` state**.
- Once locked (`LIVE`), the squad is frozen.
- **Emergency Transfers**: Reserved as an optional future feature. Would allow post-lock changes with a heavier penalty (e.g., −10 or −20 points).

### 8.4 Transfer Calculation Logic
- The system compares the newly submitted team against the **previous round's locked team**.
- Any Pool Member added or removed counts as one transfer.
- Changing Captain or Vice-Captain designation without changing the player does **not** count as a transfer.

---

## 9. Leaderboard System

Leaderboards are scoped **per group** and update only when a round is `COMPLETED`.

### 9.1 Weekly Leaderboard
- Ranks all members by their **Final Round Score** for a specific round.
- Resets/rebuilds for every new round.
- Tie-breaker suggestions (optional): Fewest transfers used, highest captain score.

### 9.2 All-Time Leaderboard
- Ranks all members by their **cumulative sum of Final Round Scores** across all `COMPLETED` rounds in the group.
- This is the primary long-term competition metric.
- Tie-breaker suggestions (optional): Number of round wins, average score per round.

### 9.3 Visibility
- Both leaderboards are visible to all members of the group.
- The admin sees the same view as members (no special leaderboard privileges).

---

## 10. Admin Scoring Workflow

1. Round reaches `ENDED` → state becomes `PENDING_SCORING`.
2. Admin navigates to the "Score Round" panel.
3. Admin sees a table of **all Pool Members** in the group.
4. Admin inputs:
   - Raw Points (numeric, can be negative, zero, or positive)
   - Card Status (None, Yellow, Red)
5. Admin **must submit scores for every member** before the round can complete.
6. Upon submission:
   - System validates that no member is missing a score.
   - System calculates all final scores.
   - System updates Weekly and All-Time leaderboards.
   - Round state changes to `COMPLETED`.
   - All members receive access to the Post-Round Summary.

---

## 11. Edge Cases & Business Rules

| Scenario | Rule |
|----------|------|
| **Member misses team deadline** | Auto-carry previous round's locked team. If first round, score is zero. |
| **Admin misses scoring deadline** | Round remains in `PENDING_SCORING`. Leaderboards do not update. Members see "Awaiting Admin Scores." |
| **Member joins mid-season** | They become a Pool Member immediately. They can be drafted by others starting from the next `UPCOMING` round. Their own first team auto-carries as zero until they set one. |
| **Member tries to leave group** | **Not allowed.** Membership is permanent. |
| **Admin tries to change `start_at`** | **Not allowed.** Start time is immutable. |
| **Admin extends `end_at` while LIVE** | Allowed. Round stays `LIVE` longer. Teams remain locked. |
| **Captain gets a Red Card** | `(Raw × 2.0) − 3`. |
| **All members score zero** | Average is zero. Top score is zero. |
| **Negative total score** | Possible if heavy card penalties and transfer penalties exceed base points. |
| **Admin invites a new friend during a LIVE round** | New friend joins the Pool but cannot be added to teams until the next `UPCOMING` round. |

---

## 12. Member Experience Flow

1. **Join**: Receive invite → Accept → Enter Group.
2. **Pre-Round**: See countdown to next round. Edit team, pick Captain/Vice, make transfers.
3. **Lock**: Team freezes. View locked squad. Wait for round to end.
4. **Post-Round**: Round ends → Admin scores → Notification that results are ready.
5. **Review**: Open Post-Round Summary. See score vs. Average vs. Top.
6. **Leaderboards**: Check Weekly rank and All-Time standing.
7. **Repeat**: Prepare team for next round during the new `UPCOMING` window.

---

## 13. Conceptual Data Relationships

```
Group
├── Admin (User)
├── Members (User[]) — permanent
├── Rounds[]
│   ├── Round Config (start_at, end_at, transfer_limit, state)
│   ├── PointsRecords[] (one per Pool Member: raw_score, card_status)
│   ├── Teams[] (one per Member: squad[], captain_id, vice_captain_id, transfer_count)
│   └── CalculatedScores[] (one per Member: final_score)
├── WeeklyLeaderboardEntries[]
└── AllTimeLeaderboardEntries[]
```

---

## 14. Key Product Principles

1. **Admin is the Oracle**: The admin is the sole source of truth for raw points and round timing.
2. **Permanence**: Group membership is for life. No exits.
3. **Automatic Enforcement**: The system handles locks, calculations, and carryovers without admin intervention.
4. **Transparency**: Every member sees exactly how their score was calculated (multipliers, cards, transfers).
5. **Flexibility**: Rounds can be any length. Scoring criteria are entirely up to the group's culture.
