const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Show your typo count in this server"),

    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        const user = db.getUser(userId, guildId);
        const count = user ? user.typo_count : 0;

        const embed = new EmbedBuilder()
            .setTitle(`📝 Typo Stats — ${interaction.user.username}`)
            .setColor(0xE67E22)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp();

        if (count === 0) {
            embed.setDescription("No typos in this server yet... suspicious. 🧐");
        } else {
            embed.setDescription(`You've made **${count}** typo${count === 1 ? "" : "s"} in this server.`);
        }

        await interaction.reply({ embeds: [embed] });
    }
};