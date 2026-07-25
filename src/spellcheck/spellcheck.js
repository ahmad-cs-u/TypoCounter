// src/spellcheck/spellcheck.js
const nspell = require("nspell");

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

module.exports = { isMisspelled };