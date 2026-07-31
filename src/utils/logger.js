const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../../logs");
const logFile = path.join(logDir, "bot.log");
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB cap

function ensureLogDir() {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
}

function rotateIfNeeded() {
    if (!fs.existsSync(logFile)) return;

    const { size } = fs.statSync(logFile);
    if (size > MAX_LOG_SIZE) {
        // Keep exactly one backup — old.log gets overwritten each rotation, so this can never grow unbounded
        fs.renameSync(logFile, path.join(logDir, "bot.old.log"));
    }
}

function formatArg(arg) {
    if (arg instanceof Error) return arg.stack;
    if (typeof arg === "object") return JSON.stringify(arg);
    return String(arg);
}

function writeLine(level, args) {
    ensureLogDir();
    rotateIfNeeded();

    const timestamp = new Date().toISOString();
    const message = args.map(formatArg).join(" ");
    fs.appendFileSync(logFile, `[${timestamp}] [${level}] ${message}\n`);
}

module.exports = {
    info(...args) {
        console.log(...args);
        writeLine("INFO", args);
    },
    warn(...args) {
        console.warn(...args);
        writeLine("WARN", args);
    },
    error(...args) {
        console.error(...args);
        writeLine("ERROR", args);
    }
};