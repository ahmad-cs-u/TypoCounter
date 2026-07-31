const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Show the server's top typo-makers"),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const rows = db.getLeaderboard(guildId, 10);

        if (rows.length === 0) {
            await interaction.reply("No typos logged in this server yet.");
            return;
        }

        const lines = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            let displayName;

            try {
                const member = await interaction.guild.members.fetch(row.user_id);
                displayName = member.displayName;
            } catch {
                displayName = "Unknown User";
            }

            lines.push(`**${i + 1}.** ${displayName} — ${row.typo_count} typo${row.typo_count === 1 ? "" : "s"}`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`📊 Typo Leaderboard — ${interaction.guild.name}`)
            .setDescription(lines.join("\n"))
            .setColor(0xE67E22)
            .setFooter({ text: `Top ${rows.length} typo-maker${rows.length === 1 ? "" : "s"}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};