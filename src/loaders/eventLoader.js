const fs=require("fs");
const path = require("path");

function loadEvents(client){
    const eventsPath = path.join(__dirname,"../events");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles){
        const filePath = path.join(eventsPath,file);
        const event = require(filePath);

        if(!("name" in event && "execute" in event)){
            console.warn(`[WARNING] Event at ${filePath} is missing "name" or "execute"; skipped.`);
            continue;
        }
        
        if (event.once){
            client.once(event.name,(...args)=> event.execute(...args));
        } else {
            client.on(event.name,(...args)=>event.execute(...args));
        }
    }
}

module.exports=loadEvents;
