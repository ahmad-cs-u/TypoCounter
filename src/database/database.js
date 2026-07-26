const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

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
    }
  };
  
  module.exports = database;
} catch (error) {
  console.error("Failed to initialize database:", error);
  process.exit(1);
}