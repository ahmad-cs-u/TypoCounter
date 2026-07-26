// test-spellcheck.js
const { isMisspelled } = require("./spellcheck/spellcheck");

(async () => {
    const words = ["don't", "isn't", "it's", "wouldn't", "hello", "wrold"];
    for (const word of words) {
        const misspelled = await isMisspelled(word);
        console.log(`${word}: ${misspelled ? "MISSPELLED" : "correct"}`);
    }
})();