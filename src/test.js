// test-spellcheck.js (temporary, not part of the app)
const { isMisspelled } = require("./spellcheck/spellcheck");

(async () => {
    const words = ["hello", "wrold", "definately", "javascript", "recieve"];
    for (const word of words) {
        const misspelled = await isMisspelled(word);
        console.log(`${word}: ${misspelled ? "MISSPELLED" : "correct"}`);
    }
})();