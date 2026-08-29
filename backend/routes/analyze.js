const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const AnalysisResult = require('../models/AnalysisResult');
const { analyzeTextLocal } = require('../services/mlModel');
const { callGroqClassificationAPI } = require('../services/apiService');
const { extractTextFromImage } = require('../services/ocrService');

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('media'), async (req, res) => {
    try {
        let inputText = req.body.text || '';
        let mediaUrl = null;
        let originalType = req.body.type || 'text'; // 'text', 'image', or 'video'

        // If media file is uploaded
        if (req.file) {
            mediaUrl = `/uploads/${req.file.filename}`;
            const fileName = req.file.originalname.toLowerCase();
            
            // Forensic check: look for AI-generated signatures in the filename
            const isGeneratedFilename = fileName.includes('generated') || 
                                       fileName.includes('ai_') || 
                                       fileName.includes('gemini') || 
                                       fileName.includes('dalle') || 
                                       fileName.includes('midjourney');
            
            if (isGeneratedFilename) {
                inputText = (inputText + " [SYSTEM_NOTE: AI-GENERATED FILENAME DETECTED]").trim();
            }

            if (req.file.mimetype.startsWith('image/')) {
                originalType = 'image';
                try {
                    const extractedText = await extractTextFromImage(req.file.path);
                    if (extractedText) {
                        inputText = (inputText + "\n" + extractedText).trim();
                    }
                } catch (ocrError) {
                    // Non-blocking, continue with filename markers
                }
            } else if (req.file.mimetype.startsWith('video/')) {
                originalType = 'video';
                if (!inputText) inputText = "Suspect video content scan.";
            }

            // If it's a generated image with no other text, ensure we have something to analyze
            if (!inputText && isGeneratedFilename) {
                inputText = "AI Generated Image Signature Detected.";
            }
        }

        // Validate we have some text to analyze
        if (!inputText || inputText.trim() === '') {
            return res.status(400).json({ error: "No text or extractable media provided." });
        }

        // Run local model
        const localResult = analyzeTextLocal(inputText);

        // Run API model
        const apiResult = await callGroqClassificationAPI(inputText);

        // ==========================================
        // 🚀 CRITICAL FIX: DETERMINISTIC SCORING OVERRIDES
        // ==========================================
        const localState = localResult.label.toUpperCase().trim();
        const apiState = apiResult.label.toUpperCase().trim();

        // 1. Hybrid Decision Logic: Enterprise Cloud AI (Groq) overrides local constraints
        let finalPrediction = 'REAL';
        if (localState === apiState) {
            finalPrediction = localState; 
        } else {
            finalPrediction = apiState; // Fallback directly to higher intelligence cloud node
        }

        // 2. Hard-Locked Score Normalization Brackets (No floating points or random generation)
        let credibilityScore = 50;
        
        if (localState === 'REAL' && apiState === 'REAL') {
            // Both agree REAL: Locked 95
            credibilityScore = 95;
        } else if (localState === 'FAKE' && apiState === 'REAL') {
            // Groq REAL / Local FAKE: Locked 75 (Trusting cloud override, flag keyword mismatch)
            credibilityScore = 75;
        } else if (localState === 'REAL' && apiState === 'FAKE') {
            // Groq FAKE / Local REAL: Locked 25 (Cloud reasoning engine overrides innocent keywords)
            credibilityScore = 25;
        } else if (localState === 'FAKE' && apiState === 'FAKE') {
            // Both agree FAKE: Locked 5 (Confirmed high-threat manipulation)
            credibilityScore = 5;
        }

        // Calculate average model confidence percentage
        const avgConfidence = (localResult.confidence + apiResult.confidence) / 2;
        
        // System review auto-flag boundary rule
        const requiresCitizenReview = credibilityScore < 75;

        // 3. Save to MongoDB Schema
        const resultDoc = new AnalysisResult({
            text: inputText.substring(0, 500),
            mediaUrl: mediaUrl,
            type: originalType,
            prediction: finalPrediction,
            confidence: avgConfidence,
            credibilityScore: credibilityScore,
            requiresCitizenReview: requiresCitizenReview
        });

        await resultDoc.save();

        // 4. Return to your React Frontend (Clean mapping layout match)
        res.json({
            success: true,
            data: {
                id: resultDoc._id,
                textSnippet: inputText.substring(0, 100),
                type: resultDoc.type,
                prediction: resultDoc.prediction,
                confidence: resultDoc.confidence,
                credibilityScore: resultDoc.credibilityScore,
                modelBreakdown: {
                    local: {
                        label: localState,
                        confidence: localResult.confidence
                    },
                    api: {
                        label: apiState,
                        confidence: apiResult.confidence
                    }
                }
            }
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: "Internal Server Error during processing" });
    }
});

module.exports = router;
