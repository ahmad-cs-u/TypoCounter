const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");
try {
  const databasePath = path.join(__dirname, "../../data/typo.db");
  
  // Create database directory if it doesn't exist
  const dataDir = path.dirname(databasePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize database
  const db = new Database(databasePath);
  
  // Enable Write-Ahead Logging
  db.pragma("journal_mode = WAL");
  
  // Initialize schema
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  db.exec(schema);

  console.log("Database initialized successfully.");

  const statements = {
    getUser: db.prepare(`
        SELECT * FROM users WHERE user_id = ? AND guild_id = ?
    `),
    createUser: db.prepare(`
        INSERT INTO users (user_id,guild_id) VALUES (?,?)
    `),
    incrementTypos: db.prepare(`
        UPDATE users SET typo_count = typo_count + 1 WHERE user_id = ? AND guild_id = ?
    `),
    logTypo: db.prepare(`
        INSERT INTO typo_log (message_id,guild_id,user_id,word) VALUES (?,?,?,?)
    `),
    getLeaderboard: db.prepare(`
        SELECT * FROM users WHERE guild_id = ? ORDER BY typo_count DESC LIMIT ?    
    `),
    getWhitelistWord: db.prepare(`
        SELECT *
        FROM whitelist
        WHERE guild_id = ?
          AND word = ?
    `),
    addWhitelistWord: db.prepare(`
        INSERT INTO whitelist
        (guild_id, word, added_by)
        VALUES (?, ?, ?)
    `),
    removeWhitelistWord: db.prepare(`
        DELETE FROM whitelist
        WHERE guild_id = ?
          AND word = ?
    `),
    getRecentTypos: db.prepare(`
        SELECT word, detected_at
        FROM typo_log
        WHERE guild_id = ? AND user_id = ?
        ORDER BY detected_at DESC
        LIMIT ?
    `),
    getGuildSettings: db.prepare(`
        SELECT * FROM guild_settings 
        WHERE guild_id = ?`
    ),
    disableSpellcheck: db.prepare(`
        INSERT OR REPLACE INTO guild_settings (guild_id, auto_spellcheck) 
        VALUES (?, 0)
    `),
    enableSpellcheck: db.prepare(`
        DELETE FROM guild_settings 
        WHERE guild_id = ?
    `),
    addIgnoredChannel: db.prepare(`
        INSERT OR IGNORE INTO ignored_channels (guild_id, channel_id) 
        VALUES (?, ?)
    `),
    removeIgnoredChannel: db.prepare(`
        DELETE FROM ignored_channels 
        WHERE guild_id = ? 
        AND channel_id = ?
    `),
    getIgnoredChannels: db.prepare(`
        SELECT channel_id 
        FROM ignored_channels 
        WHERE guild_id = ?
    `),
    addIgnoredRole: db.prepare(`INSERT OR IGNORE INTO ignored_roles (guild_id, role_id) 
        VALUES (?, ?)
    `),
    removeIgnoredRole: db.prepare(`DELETE FROM ignored_roles 
        WHERE guild_id = ? 
        AND role_id = ?
    `),
    getIgnoredRoles: db.prepare(`
        SELECT role_id 
        FROM ignored_roles 
        WHERE guild_id = ?
    `)
  };
  
  const database = {
    getUser(userId,guildId){
        return statements.getUser.get(userId,guildId);
    },
    createUser(userId,guildId){
        return statements.createUser.run(userId,guildId)
    },
    incrementTypos(userId,guildId){
        const user = this.getUser(userId,guildId);
        if (!user){
            this.createUser(userId,guildId);
        }
        return statements.incrementTypos.run(userId,guildId)
    },
    logTypo(messageId, guildId, userId, word) {
        return statements.logTypo.run(
            messageId,
            guildId,
            userId,
            word
        );
    },
    getLeaderboard(guildId, limit = 10) {
        return statements.getLeaderboard.all(guildId, limit);
    },
    getWhitelistWord(guildId, word) {
        return statements.getWhitelistWord.get(guildId, word);
    },
    addWhitelistWord(guildId, word, addedBy) {
        return statements.addWhitelistWord.run(guildId, word, addedBy);
    },
    removeWhitelistWord(guildId, word) {
        return statements.removeWhitelistWord.run(guildId, word);
    },
    getRecentTypos(userId, guildId, limit = 10) {
        return statements.getRecentTypos.all(guildId, userId, limit);
    },
    isSpellcheckEnabled(guildId) {
        const row = statements.getGuildSettings.get(guildId);
        return !row || row.auto_spellcheck === 1; // no row = enabled by default
    },
    setSpellcheckEnabled(guildId, enabled) {
        if (enabled) {
            statements.enableSpellcheck.run(guildId);
        } else {
            statements.disableSpellcheck.run(guildId);
        }
    },
    addIgnoredChannel(guildId, channelId) {
        return statements.addIgnoredChannel.run(guildId, channelId);
    },
    removeIgnoredChannel(guildId, channelId) {
        return statements.removeIgnoredChannel.run(guildId, channelId);
    },
    getIgnoredChannels(guildId) {
        return statements.getIgnoredChannels.all(guildId).map(row => row.channel_id);
    },
    addIgnoredRole(guildId, roleId) {
        return statements.addIgnoredRole.run(guildId, roleId);
    },
    removeIgnoredRole(guildId, roleId) {
        return statements.removeIgnoredRole.run(guildId, roleId);
    },
    getIgnoredRoles(guildId) {
        return statements.getIgnoredRoles.all(guildId).map(row => row.role_id);
    }
  };
  
  module.exports = database;
} catch (error) {
  logger.error("Failed to initialize database:", error);
  process.exit(1);
}