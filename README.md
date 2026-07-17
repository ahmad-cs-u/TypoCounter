# TypoCounter

A Discord bot that automatically detects spelling mistakes in messages and keeps track of each user's typo count.

The goal is to create a fun leaderboard where members can compete (or be shamed 😄) based on the number of typos they've made.

This project is also a personal learning project where I'm building the bot from scratch while learning:

- Discord.js
- Node.js
- SQLite
- Software architecture
- Git/GitHub
- Database design
- Clean project organization

---

# Planned Features

## Automatic Typo Detection

- Monitor every non-bot message
- Split messages into words
- Ignore punctuation
- Ignore numbers
- Detect misspelled words using an English dictionary

---

## Global Whitelist

A built-in whitelist stored in the project.

Examples:

- github
- docker
- npm
- lol
- bruh
- idk

These words should never count as typos.

---

## Server Whitelist

Each server can maintain its own whitelist.

Example:

```
/whitelist add poggers
/whitelist remove poggers
```

Words added here are only ignored inside that server.

---

## Typo Statistics

Commands planned:

```
/stats
```

Shows your typo count.

```
/leaderboard
```

Shows the server leaderboard.

```
/recent
```

Shows your most recent detected typos.

---

## Future Ideas

- Daily leaderboard
- Weekly leaderboard
- Typo streaks
- Most commonly misspelled words
- Export statistics
- Server configuration
- Ignore channels
- Ignore roles
- Custom dictionaries

---

# Tech Stack

- Node.js
- Discord.js
- SQLite
- better-sqlite3
- dotenv

Planned:

- nspell
- dictionary-en

---

# Current Project Structure

```
TypoCounter/

├── data/
│   └── typo.db
│
├── src/
│   ├── commands/
│   ├── config/
│   ├── database/
│   │   ├── database.js
│   │   └── schema.sql
│   ├── events/
│   ├── loaders/
│   ├── spellcheck/
│   ├── utils/
│   └── whitelist/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# Database Schema

Current tables:

- users
- typo_log
- whitelist
- guild_settings

---

# Current Progress

## ✅ Phase 1 — Project Foundation

Completed

- Installed Node.js
- Installed Discord.js
- Installed dotenv
- Git initialized
- GitHub repository created
- Project initialized with npm
- Basic project structure created

---

## ✅ Phase 2 — Discord Bot

Completed

- Discord application created
- Bot account created
- OAuth invite configured
- Bot invited to server
- Slash commands working
- /ping command implemented
- /testdb command implemented

---

## ✅ Phase 3 — Database Foundation

Completed

- SQLite integrated
- better-sqlite3 installed
- Database auto-initialization
- SQL schema separated into schema.sql
- Automatic table creation
- Database abstraction layer
- Prepared statements
- Helper functions
- Database successfully tested from Discord

---

# Remaining Roadmap

## Phase 4 — Command & Event Loader

Goal:

Automatically load commands and events from folders.

Benefits:

- No manual imports
- Easier scalability
- Cleaner architecture

---

## Phase 5 — Spell Checking Engine

Install:

- nspell
- dictionary-en

Implement:

- Dictionary loading
- Word normalization
- Message parsing
- Spell checking
- Ignore punctuation
- Ignore numbers

---

## Phase 6 — Typo Detection

Implement:

- messageCreate event
- Ignore bots
- Ignore commands
- Count misspelled words
- Save typo logs
- Increment typo counts

---

## Phase 7 — Whitelist System

Implement:

Global whitelist

Server whitelist

Commands:

```
/whitelist add
/whitelist remove
/listwhitelist
```

---

## Phase 8 — Statistics

Commands:

```
/stats
/leaderboard
/recent
```

---

## Phase 9 — Guild Settings

Per-server configuration

Examples:

- Enable/disable spell checking
- Count duplicate words
- Minimum word length
- Ignore bots
- Ignore channels
- Ignore roles

---

## Phase 10 — Polish

- Better embeds
- Error handling
- Logging
- Performance improvements
- Documentation
- Deployment

---

# Current Status

Overall Progress:

```
████████████░░░░░░░░░░░░░░

≈ 35%
```

The project now has a working Discord bot, a functioning SQLite database, and a reusable database abstraction layer.

The next major milestone is implementing the spell-checking engine, which will transform the project from a framework into an actual typo-counting bot.

---

# Notes for Future Me

Things that are already working:

- Discord bot connection
- Slash commands
- SQLite connection
- Automatic schema creation
- Database helper functions
- Database tested through Discord

Things NOT implemented yet:

- Automatic command loader
- Event loader
- Spell checking
- Typo detection
- Whitelist system
- Statistics
- Leaderboards
- Deployment

---

# Long-Term Goal

Create a modular, well-documented Discord bot that follows good software engineering practices instead of becoming a single massive `index.js` file.

The emphasis of this project is not only building a fun bot, but also learning professional backend architecture, database design, and maintainable JavaScript development.