require("./database/database");
// Load environment variables
require('dotenv').config();
// Import discord.js classes
const {Client,GatewayIntentBits}=require('discord.js')
// Create client
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
// Ready event
client.once('clientReady',()=>{
    console.log(`Logged in as ${client.user.tag}`);
});
// Login
client.login(process.env.DISCORD_TOKEN);
// Adding ping command
const pingCommand = require('./commands/ping');
//Adding testDb command
const testdbCommand = require('./commands/testdb')
client.on('interactionCreate',async(interaction)=>{
    if(!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping'){
        await pingCommand.execute(interaction);
    } else if (interaction.commandName === "testdb"){
        await testdbCommand.execute(interaction);
    }
});