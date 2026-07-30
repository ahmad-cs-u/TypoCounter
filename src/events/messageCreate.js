const db = require("../database/database");
const {findTypos} = require("../spellcheck/spellcheck");

const snappyReplies = [
    "Another typo added to {user}'s growing library of new vocabulary",
    "{user} just invented a new word: \"{word}\"",
    "Careful {user}, \"{word}\" isn't a word... yet",
    "{user}'s keyboard seems to be having a rough day",
    "Adding \"{word}\" to the dictionary of {user}-isms"
];

function buildReply(username,word){
    const template = snappyReplies[Math.floor(Math.random() * snappyReplies.length)];
    return template.replace("{user}",username).replace("{word}", word);
}

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if (message.author.bot) return;
        if (!message.content || message.content.trim().length === 0) return;

        const guildId = message.guild.id;

        if (!db.isSpellcheckEnabled(guildId)) return;

        const ignoredChannels = db.getIgnoredChannels(guildId);
        if (ignoredChannels.includes(message.channel.id)) return;

        const ignoredRoles = db.getIgnoredRoles(guildId);
        const memberRoleIds = message.member.roles.cache.map(role => role.id);
        if (memberRoleIds.some(roleId => ignoredRoles.includes(roleId))) return;

        const userId = message.author.id;
        const typos = await findTypos(message.content, guildId);
        if (typos.length === 0) return;

        for (const word of typos) {
            db.incrementTypos(userId, guildId);
            db.logTypo(message.id, guildId, userId, word);
        }

        const reply = buildReply(message.author.username, typos[0]);
        await message.reply(reply);
    }
};