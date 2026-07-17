const db = require("../database/database");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testdb")
        .setDescription("Test the database"),

    async execute(interaction) {

        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        db.incrementTypos(userId, guildId);

        const user = db.getUser(userId,guildId);
        await interaction.reply(`Your typo count is now ${user.typo_count}`);

    }
};