const fs = require("fs");
const path = require("path");
const db = require("../database/database");

const globalPath = path.join(__dirname,"global.txt");
const globalWords=new Set(
    fs.readFileSync(globalPath,"utf8").split(/\r?\n/).map(word => word.trim().toLowerCase()).filter(word => word.length > 0)
);

function isWhitelisted(word,guildId){
    const normalized=word.toLowerCase();

    if (globalWords.has(normalized)) return true;

    const entry = db.getWhitelistWord(guildId,normalized);
    return !!entry;
}

module.exports={isWhitelisted}