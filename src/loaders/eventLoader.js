const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

function loadEvents(client) {
    const eventsPath = path.join(__dirname, "../events");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (!("name" in event && "execute" in event)) {
            logger.warn(`[WARNING] Event at ${filePath} is missing "name" or "execute"; skipped.`);
            continue;
        }

        const handler = (...args) => {
            Promise.resolve(event.execute(...args)).catch(error => {
                logger.error(`[ERROR] Unhandled error in event "${event.name}":`, error);
            });
        };

        if (event.once) {
            client.once(event.name, handler);
        } else {
            client.on(event.name, handler);
        }
    }
}

module.exports = loadEvents;