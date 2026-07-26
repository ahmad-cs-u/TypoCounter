// test-findtypos.js
const { findTypos } = require("./src/spellcheck/spellcheck");

(async () => {
    const sample = "I definately recieve this wrold everyday but not really";
    const typos = await findTypos(sample);
    console.log(typos);
})();