const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

function loadCommands(){
    const commands = new Collection();
    const commandsPath = path.join(__dirname,"../commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles){
        const filePath = path.join(commandsPath,file);
        const command = require(filePath);

        if ("data" in command && "execute" in command){
            commands.set(command.data.name, command);
        } else {
            console.warn(`[WARNING] Command at ${filePath} is missing "data" or "execute"; skipped.`);
        }
    }
    return commands;
}

module.exports = loadCommands;