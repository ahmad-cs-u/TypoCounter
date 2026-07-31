const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recent")
        .setDescription("Show your most recent detected typos in this server"),

    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        const rows = db.getRecentTypos(userId, guildId, 10);

        const embed = new EmbedBuilder()
            .setTitle(`🕒 Recent Typos — ${interaction.user.username}`)
            .setColor(0xE67E22)
            .setTimestamp();

        if (rows.length === 0) {
            embed.setDescription("You haven't made any typos in this server yet.");
        } else {
            const lines = rows.map((row, i) => `**${i + 1}.** "${row.word}"`);
            embed.setDescription(lines.join("\n"));
        }

        await interaction.reply({ embeds: [embed] });
    }
};