// test-normalize.js
const { normalizeMessage } = require("./src/spellcheck/normalize");

const sample = "Yoo this is soo cool!! visit https://github.com or idk maybe 42 times don't ya think? 😂";
console.log(normalizeMessage(sample));
// test-normalize.js (extend it)
console.log(normalizeMessage("Hi this is an :fire: fire emoji"));
console.log(normalizeMessage("check this out <:pepehands:123456789012345678> so sad"));
console.log(normalizeMessage("Hi this is an :frie: fire emoji"));