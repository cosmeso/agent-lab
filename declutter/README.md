# Declutter Agents 🧹

Small Claude agents that help you clear digital slop off your iPhone and out of your life.
They run in the **Claude iPhone app**. Each one is a prompt; you send it screenshots and it tells you what to cut and exactly where to tap.

| Agent | What it does |
|---|---|
| 🧭 Declutter Coach | Start here. Picks one area and runs a 15-minute session |
| 📸 Photo Purger | Screenshots, duplicates, blurry shots, meme hoards |
| 📥 Inbox Slop Sweeper | Unsubscribe / filter / keep, sender by sender |
| 💸 App & Subscription Auditor | Unused apps, forgotten subscriptions, home screen |
| 🔕 Notification Silencer | Only people and urgent things get to interrupt you |
| 🧹 Feed Detox | Follow audits, plus an "is this slop?" judge |
| 🗂 Notes, Files & Tabs Janitor | Dead notes, Downloads junk, tab hoards |
| 🔁 Weekly Reset | A 10-minute Sunday routine so it stays clean |

## Use it on your iPhone

**Option A: one Project (best).** On claude.ai, create a Project called "Declutter" and paste
[`ALL_IN_ONE.md`](ALL_IN_ONE.md) into its instructions. Then, in the Claude iPhone app, open that project and say "start".

**Option B: one agent at a time.** Open `declutter/index.html` (on the published site, at `/declutter/`), tap an agent, tap **Copy prompt**, and paste it into a new Claude chat.

Every agent only *suggests*. You do the deleting yourself, and each agent flags anything irreplaceable first.

## Editing

The prompts live in `agents/*.md`. After you change one, rebuild the page and the all-in-one file:

```
python3 agents/build_declutter.py
```
