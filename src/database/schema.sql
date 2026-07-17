CREATE TABLE IF NOT EXISTS users (
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    typo_count INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, guild_id)
);

CREATE TABLE IF NOT EXISTS typo_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    message_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,

    word TEXT NOT NULL,

    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whitelist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    guild_id TEXT NOT NULL,

    word TEXT NOT NULL,

    added_by TEXT,

    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,

    auto_spellcheck INTEGER NOT NULL DEFAULT 1,

    count_duplicate_words INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS whitelist_unique
ON whitelist(guild_id, word);

CREATE UNIQUE INDEX IF NOT EXISTS typo_message_unique
ON typo_log(message_id, word);