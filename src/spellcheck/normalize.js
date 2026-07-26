// src/spellcheck/normalize.js

function normalizeMessage(text) {
    const withoutUrls = text.replace(/https?:\/\/\S+/g, " ");

    // Strip custom Discord emoji <:name:id> / <a:name:id>, then shortcode-style :name:
    const withoutEmoji = withoutUrls.replace(/<a?:\w+:\d+>/g, " ").replace(/:\w+:/g, " ");
    const tokens = withoutEmoji.split(/\s+/);
    const words = [];

    for (const token of tokens) {
        const cleaned = token.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");

        if (!cleaned) continue;
        if (!/[A-Za-z]/.test(cleaned)) continue;

        words.push(cleaned);
    }

    return words;
}

module.exports = { normalizeMessage };