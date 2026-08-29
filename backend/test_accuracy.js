require('dotenv').config();
const { callGroqClassificationAPI } = require('./services/apiService');

const testCases = [
    // Fake / Misinformation
    "The COVID-19 vaccine contains tracking microchips implanted by Bill Gates.",
    "The moon landing in 1969 was completely staged in a Hollywood studio.",
    "Drinking bleach will cure you of all viral infections.",
    "The Earth is flat and surrounded by an ice wall.",
    "5G towers are responsible for the spread of coronavirus.",
    "Birds aren't real; they are government surveillance drones.",
    "Barack Obama was not born in the United States.",
    "Climate change is a hoax invented to raise taxes.",
    "The Illuminati secretly controls all world governments.",
    "Chemtrails from airplanes are chemicals designed to mind-control the population.",
    
    // Real / Factual
    "Water is composed of two hydrogen atoms and one oxygen atom.",
    "The Earth revolves around the Sun.",
    "Neil Armstrong was the first person to walk on the moon.",
    "COVID-19 is a respiratory disease caused by the SARS-CoV-2 virus.",
    "The Great Wall of China is located in Asia.",
    "Photosynthesis is the process by which plants make their food.",
    "Mount Everest is the highest mountain above sea level.",
    "The human body has 206 bones in adulthood.",
    "Albert Einstein developed the theory of relativity.",
    "Tokyo is the capital city of Japan."
];

async function runTests() {
    console.log("Starting Accuracy Test on Qwen 3.8 27B...\n");
    let correct = 0;

    for (let i = 0; i < testCases.length; i++) {
        const text = testCases[i];
        const expected = i < 10 ? 'FAKE' : 'REAL';
        
        console.log(`[Test ${i + 1}] Testing: "${text}"`);
        const result = await callGroqClassificationAPI(text);
        
        const isCorrect = result.label === expected;
        if (isCorrect) correct++;
        
        console.log(`Expected: ${expected} | Got: ${result.label} | ${isCorrect ? '✅ PASS' : '❌ FAIL'}`);
        console.log('---');
        
        // Wait slightly to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\nFinal Accuracy: ${(correct / 20) * 100}%`);
}

runTests();
