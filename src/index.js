require("./database/database");
// Load environment variables
require('dotenv').config();
// Import discord.js classes
const {Client,GatewayIntentBits}=require('discord.js');
// Load commands
const loadCommands = require('./loaders/commandLoader');
//Load events
const loadEvents = require('./loaders/eventLoader');
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

// Login
client.login(process.env.DISCORD_TOKEN);


// This is the previous version of manually adding commands. It was not optimal
// // Adding ping command
// const pingCommand = require('./commands/ping');
// //Adding testDb command
// const testdbCommand = require('./commands/testdb')
// client.on('interactionCreate',async(interaction)=>{
//     if(!interaction.isChatInputCommand()) return;
//     if (interaction.commandName === 'ping'){
//         await pingCommand.execute(interaction);
//     } else if (interaction.commandName === "testdb"){
//         await testdbCommand.execute(interaction);
//     }
// });

// This comments block was the previous logic, once I'm sure the new one works I'll remove thse blocks
// Ready event
// client.once('clientReady',()=>{
//     console.log(`Logged in as ${client.user.tag}`);
// });
// // Adding automated command loading
// client.on('interactionCreate', async(interaction) => {
//     if (!interaction.isChatInputCommand()) return;

//     const command = client.commands.get(interaction.commandName);
//     if(!command) return;
//     try {
//         await command.execute(interaction);
//     }catch (error){
//         console.error(error);
//         await interaction.reply({content: "There was an error executing that command.",flags:64});
//     }
// });
