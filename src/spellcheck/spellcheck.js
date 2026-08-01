const nspell = require("nspell");
const { isWhitelisted } = require("../whitelist/whitelist");

async function loadDictionary() {
    const dictionaryEn = (await import("dictionary-en")).default;
    const dict = await dictionaryEn;
    return dict;
}

const spellPromise = loadDictionary().then(dict => {
    console.log("Spellcheck dictionary loaded.");
    return nspell(dict);
});

async function isMisspelled(word) {
    const spell = await spellPromise;
    return !spell.correct(word);
}

const {normalizeMessage} = require("./normalize");

async function findTypos(text, guildId) {
    const words = normalizeMessage(text);
    const seen = new Set();
    const typos = [];

    for (const word of words) {
        const normalized = word.toLowerCase();

       if (seen.has(normalized)) continue; // already counted this word for this message
        if (isWhitelisted(word, guildId)) continue;

        if (await isMisspelled(word)) {
            seen.add(normalized);
            typos.push(word);
        }
    }

    return typos;
}

module.exports = { isMisspelled, findTypos };