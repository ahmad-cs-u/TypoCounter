// src/spellcheck/spellcheck.js
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

async function findTypos(text,guildId){
    const words = normalizeMessage(text);
    const typos = [];

    for (const word of words){
        if (isWhitelisted(word,guildId)) continue;
        if (await isMisspelled(word)){
            typos.push(word);
        }
    }

    return typos;
}

module.exports = { isMisspelled, findTypos };