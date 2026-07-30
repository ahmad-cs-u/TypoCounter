const {SlashCommandBuilder}=require("discord.js");
const db = require("../database/database");

module.exports = {
    data : new SlashCommandBuilder().setName("recent").setDescription("Show your most recent detected typos in this server."),

    async execute(interaction){
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        const rows = db.getRecentTypos(userId,guildId,10);

        if (rows.length===0){
            await interaction.reply("You haven't made any typos in this server yet.");
            return;
        }

        const lines = rows.map((row,i)=>`**${i + 1}** "${row.word}"`);

        await interaction.reply(`**Your recent typos:**\n${lines.join("\n")}`);
    }
};