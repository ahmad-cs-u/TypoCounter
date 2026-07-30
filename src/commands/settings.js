const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const db = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Configure TypoCounter for this server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName("spellcheck")
                .setDescription("Enable or disable typo detection in this server")
                .addBooleanOption(option =>
                    option.setName("enabled")
                        .setDescription("Turn spellcheck on or off")
                        .setRequired(true)
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName("channel")
                .setDescription("Manage ignored channels")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("add")
                        .setDescription("Stop checking typos in a channel")
                        .addChannelOption(option =>
                            option.setName("channel")
                                .setDescription("The channel to ignore")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("remove")
                        .setDescription("Resume checking typos in a channel")
                        .addChannelOption(option =>
                            option.setName("channel")
                                .setDescription("The channel to stop ignoring")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName("role")
                .setDescription("Manage ignored roles")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("add")
                        .setDescription("Stop checking typos from members with this role")
                        .addRoleOption(option =>
                            option.setName("role")
                                .setDescription("The role to ignore")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("remove")
                        .setDescription("Resume checking typos from members with this role")
                        .addRoleOption(option =>
                            option.setName("role")
                                .setDescription("The role to stop ignoring")
                                .setRequired(true)
                        )
                )
        ),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const group = interaction.options.getSubcommandGroup(false); // false = don't error if there isn't one
        const subcommand = interaction.options.getSubcommand();

        if (!group && subcommand === "spellcheck") {
            const enabled = interaction.options.getBoolean("enabled");
            db.setSpellcheckEnabled(guildId, enabled);
            await interaction.reply(`Spellcheck is now **${enabled ? "enabled" : "disabled"}** in this server.`);
            return;
        }

        if (group === "channel") {
            const channel = interaction.options.getChannel("channel");

            if (subcommand === "add") {
                db.addIgnoredChannel(guildId, channel.id);
                await interaction.reply(`Now ignoring typos in ${channel}.`);
            } else if (subcommand === "remove") {
                db.removeIgnoredChannel(guildId, channel.id);
                await interaction.reply(`No longer ignoring typos in ${channel}.`);
            }
            return;
        }

        if (group === "role") {
            const role = interaction.options.getRole("role");

            if (subcommand === "add") {
                db.addIgnoredRole(guildId, role.id);
                await interaction.reply(`Now ignoring typos from members with the ${role} role.`);
            } else if (subcommand === "remove") {
                db.removeIgnoredRole(guildId, role.id);
                await interaction.reply(`No longer ignoring typos from members with the ${role} role.`);
            }
            return;
        }
    }
};