require('dotenv').config();
const {REST, Routes}=require('discord.js');
const loadCommands = require('./loaders/commandLoader');

const commands = loadCommands().map(command=>command.data.toJSON());

//The commented out section was the previous way to add commands, not clever
// const pingCommand=require('./commands/ping');
// const testdbCommand = require('./commands/testdb');
// const commands = [
//     pingCommand.data.toJSON(),
//     testdbCommand.data.toJSON()
// ];
const rest=new REST({version:'10'}).setToken(process.env.DISCORD_TOKEN);
const CLIENT_ID = '1527370633279967393';
const GUILD_ID = '1124664429896814674';
(async()=>{
    try{
        console.log(`Registering ${commands.length} slash command(s)...`);
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID),{body:commands});
        console.log('Slash commands registered.');
    } catch (error){
        console.error(error);
    }
})();