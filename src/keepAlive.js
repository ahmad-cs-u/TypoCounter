const http = require("http");

function startKeepAliveServer(port = 3000){
    const server = http.createServer((req,res)=>{
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.end("TypoCounter is alive.");
    });

    server.listen(port,()=>{
        console.log(`Keep-alive server listening on port ${port}`);
    });
}

module.exports = {startKeepAliveServer};