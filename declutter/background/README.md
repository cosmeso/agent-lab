# Background agents (scheduled tasks)

These run in the cloud on a schedule, read your Gmail and school Outlook (Microsoft 365), and send a notification to your phone through the Claude app.
They are **read-only**: they never send, delete, or unsubscribe anything.

## Set one up (about 2 minutes each)

1. On claude.ai, open your **scheduled tasks** (routines) and create a new one.
2. Paste the prompt from the file below.
3. Set the schedule (all times are Eastern).
4. Turn on the **Gmail** and **Microsoft 365** connectors for it. Without them, the agent can't see your email.
5. Turn on **push notifications**.

| Agent | File | Schedule (Eastern) |
|---|---|---|
| 🌅 Morning Brief | `morning-brief.md` | Every day, 7:40am |
| 🚨 Don't-Miss-It Watch | `dont-miss-it.md` | Every day, 12:17pm, 3:17pm, 6:17pm, 9:17pm |
| 💸 Money Radar | `money-radar.md` | Wednesdays, 6:43pm |
| 🧹 Weekly Slop Report | `weekly-slop-report.md` | Sundays, 4:23pm |
