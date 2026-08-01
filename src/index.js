require("./database/database");
// Load environment variables
require('dotenv').config();
// Import discord.js classes
const {Client,GatewayIntentBits}=require('discord.js');
// Load commands
const loadCommands = require('./loaders/commandLoader');
// Load events
const loadEvents = require('./loaders/eventLoader');
// Load keepAlive server
const {startKeepAliveServer} = require("./keepAlive");
// Load logger
const logger = require("./utils/logger");
// To handle fatal errors
const MAX_ERRORS = 10;
const STABILITY_RESET_MS = 60 * 60 * 1000; // 1 hour of no errors resets the counter

let errorCount = 0;
let resetTimer = null;

function handleFatalError(type, error) {
    errorCount++;
    logger.error(`[ERROR-AVOIDED] ${type} (${errorCount}/${MAX_ERRORS}):`, error);

    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        logger.info("No errors for a while — resetting error counter.");
        errorCount = 0;
    }, STABILITY_RESET_MS);

    if (errorCount >= MAX_ERRORS) {
        logger.error(`[FATAL] ${MAX_ERRORS} errors occurred without a stable period between them. Shutting down.`);
        process.exit(1);
    }
}

process.on("unhandledRejection", (reason) => handleFatalError("Unhandled promise rejection", reason));
process.on("uncaughtException", (error) => handleFatalError("Uncaught exception", error));

// Create client
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = loadCommands();
loadEvents(client);
// Start Server
startKeepAliveServer(process.env.PORT||3000);
// Login
client.login(process.env.DISCORD_TOKEN);
