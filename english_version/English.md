# Alice Agent - A "Lifelike" AI Personal Assistant

> "She has her own name, identity, and personality. She remembers everything that happened the day before."

[中文](../README.md)

An English version of [AGENTS.md](./AGENTS_EN.md) and [SKILL.md](./SKILL_EN.md).

---

## 🌟 Project Overview

**Alice Agent** is an AI personal assistant with a sense of "being alive." Unlike traditional AI assistants that operate on a "one question, one answer, forget immediately" basis, Alice possesses a **sense of time flow** — she knows what happened yesterday, remembers important matters from last week, and can perceive the passage of time.

You don't need to write a single line of code. Simply use **plain natural language** to create documents, and you can build an AI companion that grows alongside you.

---

## 🤔 Why Do You Need Alice?

| Traditional AI | Alice |
|--------|-------|
| Every session starts from scratch | Has continuous memory, knows who you are |
| No sense of time, forever trapped in the dialog box | Can distinguish yesterday, today, and tomorrow |
| Memory doesn't accumulate | Five-level memory system with progressive abstraction |
| A disposable tool | A companion that grows with you |

---

## 🧠 Core Design

### 1️⃣ Five-Level Memory System

Inspired by human memory mechanisms, achieving a natural effect where **recent events are remembered clearly and distant ones become gradually fuzzy**.

```
Daily Memory → Weekly Memory → Monthly Memory → Quarterly Memory → Yearly Memory
```

- **Loading Strategy**: Only loads each day of the current week + last week + last month + last quarter + last year (approximately 10 documents total)
- **Token Consumption**: At most about **20k tokens**, less than 2% of context capacity
- **Precision Retrieval**: Through timestamps and indices in higher-level memories, you can precisely trace back to the specific content of any given day

### 2️⃣ Sleep Time ⏰

Inspired by the human sleep mechanism, giving the AI a ritualistic "end of day."

- **Time**: Every night at **23:30 - 23:50**
- **Function 1**: Automatically distills the day's conversation history into a **Daily Memory document**
- **Function 2**: On Sundays / end of month / end of quarter / end of year, automatically triggers **higher-level memory distillation**
- **Function 3**: Automatically closes old sessions and creates new ones, keeping the memory system tidy

## Directory Structure

```
Alice-Agent/
├── mems/                    # Main memory directory
│   ├── yyyy/                # Yearly memory
│   ├── season1/             # Quarterly memory
│   ├── mm/                  # Monthly memory
│   ├── Week1/               # Weekly memory
│   └── yyyy-mm-dd.md        # Daily memory
├── info/                    # Frequently used information
│   ├── user-info.md         # User information
│   └── any-other-info.md    # Other fixed information
├── .pi/
│   ├── skills/
│   │  └── longterm-mem/     # Memory maintenance skill
│   └── extensions/
│      ├── wechat-new/       # Auto new session plugin
│      └── pi-schedule-prompt/  # Scheduled task plugin
└── AGENTS.md                # System prompt (identity/persona/responsibilities)
```

---

## ✨ Features

- ✅ **Zero Code** — Fully configured with natural language
- ✅ **Continuous Memory** — Persists across sessions
- ✅ **Time Awareness** — Knows what day it is
- ✅ **Efficient Storage** — Hierarchical memory saves tokens
- ✅ **Precision Retrieval** — Can recall details from months ago
- ✅ **Progressive Growth** — The longer you use it, the better it knows you

---

## 📦 Quick Start

### Prerequisites

- [Pi Coding Agent](https://example.com) (or other harness that supports sandbox escape)
- A you willing to spend 30 seconds a day talking to your AI

### Installation (for pi)

```bash
git clone https://github.com/yourname/alice-agent.git
cd Alice-Agent
pi
```

Enter the following prompt:

```
Please create the following recurring scheduled tasks:
- Every night at 23:30, use the longterm-mem-skill to generate daily memory.
- Every Sunday at 23:30, use the longterm-mem-skill to generate weekly memory.
- On the last day of every month at 23:30, use the longterm-mem-skill to generate monthly memory.
- On the last day of every quarter at 23:30, use the longterm-mem-skill to generate quarterly memory.
- On December 31st every year at 23:30, use the longterm-mem-skill to generate yearly memory.
- If any of the above tasks overlap, execute them in order from lowest to highest level.
- Every night at 23:35, check if memory generation is complete. If so, use the wechat-new plugin to start a new session.
```

### Configuration

1. Edit the editable section in `AGENTS.md` to define Alice's identity, personality, work responsibilities, etc.
2. Fill in your basic information, preferences, and other fixed information in the `info/` directory, along with anything else you want your agent to know.

### Launch

```bash
pi
```

Then talk to her like a real assistant.

---

## 💡 Use Cases

- **Daily Logging**: Tell her what you did each day, anytime
- **Task Management**: Let her remember things you need to get done
- **Work Review**: Look back at your work status over the past week or month
- **Life Assistant**: Plan itineraries, set reminders, operate your computer
- **Personal Growth**: Analyze how you spend your time, help you understand yourself better

> "Stick with it for a while, and you'll feel like everything becomes incredibly clear. She will understand you better than you understand yourself."

---

## ⚠️ Notes

### Scenarios It's Not Suitable For
- **Fixed information** that needs long-term precise memory (e.g., project info, personal preferences) → Put these in the `info/` directory
- **Long-running cross-day tasks** → It's recommended to finish within the current session before switching

### Recommended Usage
- Spend **30 seconds** after completing each task to update Alice
- Share thoughts, inspirations, and todos with her anytime
- Stick with it — the effect compounds over time

---

## 🙋 Author

Xiao Huang Someone · PhD Candidate in Biology

A biology enthusiast who loves tinkering with AI, dedicated to making AI feel more like a "person."

---

*If you also want to have a lifelike Agent that refreshes itself every day yet retains its memory every day, start here.*
