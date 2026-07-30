const {SlashCommandBuilder} = require("discord.js");
const db = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("Show your typo count in this server"),

    async execute(interaction){
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        const user = db.getUser(userId,guildId);
        const count = user ? user.typo_count : 0;

        if(count === 0){
            await interaction.reply("You haven't made any typos in this server yet... suspicious.");
            return;
        }

        await interaction.reply(`You've made **${count}** typo${count===1?"":"s"} in this server.`);
    }
};