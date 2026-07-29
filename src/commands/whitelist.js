// src/commands/whitelist.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Manage this server's typo whitelist")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a word to this server's whitelist")
                .addStringOption(option =>
                    option.setName("word")
                        .setDescription("The word to whitelist")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a word from this server's whitelist")
                .addStringOption(option =>
                    option.setName("word")
                        .setDescription("The word to remove")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const rawWord = interaction.options.getString("word");
        const word = rawWord.trim().toLowerCase();
        const guildId = interaction.guild.id;

        if (!word) {
            await interaction.reply({ content: "That's not a valid word.", flags: 64 });
            return;
        }

        if (subcommand === "add") {
            const existing = db.getWhitelistWord(guildId, word);
            if (existing) {
                await interaction.reply({ content: `"${word}" is already whitelisted here.`, flags: 64 });
                return;
            }

            db.addWhitelistWord(guildId, word, interaction.user.id);
            await interaction.reply(`Added "${word}" to this server's whitelist.`);
        } else if (subcommand === "remove") {
            const existing = db.getWhitelistWord(guildId, word);
            if (!existing) {
                await interaction.reply({ content: `"${word}" isn't on this server's whitelist.`, flags: 64 });
                return;
            }

            db.removeWhitelistWord(guildId, word);
            await interaction.reply(`Removed "${word}" from this server's whitelist.`);
        }
    }
};