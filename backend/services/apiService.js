const Groq = require('groq-sdk');
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Calls Groq LLaMA API to classify text as REAL or FAKE.
 * @param {string} text 
 */
async function callGroqClassificationAPI(text) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a fact-checking AI. First, analyze the claim step-by-step for truthfulness, checking for known misinformation patterns. Then, you must output your final verdict as a JSON object with a single key 'verdict' containing exactly 'REAL' or 'FAKE'. Example: {\"verdict\": \"FAKE\"}"
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "qwen/qwen3.8-27b",
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0]?.message?.content?.trim() || "{}";
        const parsed = JSON.parse(responseContent);
        let label = parsed.verdict?.toUpperCase();

        if (!label || (!label.includes('REAL') && !label.includes('FAKE'))) {
            label = 'REAL'; // Default fallback
        } else if (label.includes('FAKE')) {
            label = 'FAKE';
        } else {
            label = 'REAL';
        }

        return {
            source: 'Groq LLaMA Cloud API',
            label: label,
            confidence: 95.0 // Hardcoded confidence as LLMs don't natively return probability scores without logprobs
        };
    } catch (error) {
        console.error("Groq Classification Error:", error.message);
        // Fallback mock
        return {
            source: 'Groq LLaMA Fallback',
            label: 'REAL',
            confidence: 50.0
        };
    }
}

/**
 * Calls Groq LLaMA to perform sentiment analysis on community comments.
 * @param {string} text Concatenated text of all comments
 */
async function getSentimentAnalysis(text) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Analyze the sentiment of the following community notes regarding a forensic verification. Think step by step about the community's overall consensus. Then, return exactly one JSON object with four keys: 'analysis' (your step-by-step reasoning), 'sentiment' (must be one of: 'POSITIVE', 'NEGATIVE', 'NEUTRAL'), 'confidence' (a number between 0 and 100), and 'summary' (a brief 1-2 sentence explanation of the consensus). Example: {\"analysis\": \"Most users agree it's false because...\", \"sentiment\": \"NEGATIVE\", \"confidence\": 92, \"summary\": \"The community universally agrees this is a hoax.\"} Do not output any markdown formatting or extra text outside the JSON block."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "qwen/qwen3.8-27b",
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0]?.message?.content?.trim() || "{}";
        const parsed = JSON.parse(responseContent);

        return {
            sentiment: parsed.sentiment || 'NEUTRAL',
            confidence: parsed.confidence || 85.0,
            summary: parsed.summary || "Consensus reached based on multiple citizen viewpoints.",
            isMock: false
        };
    } catch (error) {
        console.error("Groq Sentiment Error:", error.message);
        return {
            sentiment: 'NEUTRAL',
            confidence: 50.0,
            summary: "Failed to generate sentiment consensus due to an API error.",
            isMock: true
        };
    }
}

module.exports = {
    callGroqClassificationAPI,
    getSentimentAnalysis
};
