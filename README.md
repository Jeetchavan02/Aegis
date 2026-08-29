<div align="center">

<img src="https://img.shields.io/badge/Aegis_Intel-Forensic%20Platform-indigo?style=for-the-badge&logo=shield" alt="Aegis Intel" />

# 🛡️ Aegis Intel — Deepfake & Misinformation Forensic Engine

### *Bridging the gap between automated AI detection and nuanced human context.*

[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-brightgreen?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev)
[![Groq](https://img.shields.io/badge/AI_Engine-Groq_Qwen-red?style=flat-square)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

> **Aegis Intel** is a comprehensive forensic engine designed to detect deepfakes, AI-generated propaganda, and misinformation. Built to address the challenges of digital deception during high-stakes situations, it features a deterministic hybrid reasoning engine and a secure "Citizen Review" feed for verifying digital truth.

</div>

---

## 🎥 Demo & Presentation

> **[Google Drive Link - Demo Video & PPT Slides](https://drive.google.com/drive/folders/1_AXP4Najmk-FtxfUqTGZ-Jrb5Pw-Uiqq?usp=sharing)**
> *Note: This Google Drive folder contains both the project demo video and the presentation slides.*

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [🔐 Authentication & Roles](#-authentication--roles)
- [🧠 Scoring Logic](#-scoring-logic)
- [🚧 Known Limitations & Edge Cases](#-known-limitations--edge-cases)
- [🚀 Future Roadmap](#-future-roadmap)

---

## ✨ Features

### 👤 Citizen / Analyst Facing
| Feature | Description |
|---|---|
| 🔍 **Threat Scanner** | Submit suspicious text, links, or metadata for instant forensic analysis. |
| 🤖 **Hybrid AI Verification** | Cross-references claims using both a local statistical model and Groq Qwen-3.8-27b. |
| 🛡️ **Credibility Scoring** | Deterministic 0-100 scoring logic that categorizes content as Verified, Suspicious, or Manipulated. |
| 👥 **Citizen Review Feed** | A secure dashboard where analysts can manually submit evidence for borderline/conflicted content. |
| 📊 **Diagnostic Trace** | Transparent breakdown showing exactly how the local and cloud AI models voted. |
| 📱 **Threat Dashboard** | Visual analytics and history logs of recent scans and verifications. |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js** | Core UI library |
| **Vite** | Blazing fast build tool and dev server |
| **Vanilla CSS** | Glassmorphism & tech-forward styling |
| **Lucide React** | Scalable SVG iconography |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | High-performance REST API |
| **MongoDB + Mongoose** | Document database for history and logs |
| **Groq SDK** | Cloud interface for the Qwen-3.8-27B reasoning model |
| **bcryptjs + JWT** | Cryptographic password hashing and stateless session tokens |
| **natural** | Local Naive Bayes NLP keyword fallback model |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16+)
- **MongoDB** Atlas Cluster (or local MongoDB)
- **Python** (v3.8+) *(If running the legacy ML Service)*

### 1. Clone the Repository
```bash
git clone https://github.com/Jeetchavan02/Aegis.git
cd Aegis
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create your `.env` file (see Environment Variables below), then start the server:
```bash
npm run dev
# or: node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5005
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=your_groq_cloud_api_key
```

---

## 🔐 Authentication & Roles

- **JWT Tokens:** Issued on login and used to securely protect API endpoints.
- **Password Hashing:** Handled via `bcryptjs` before persisting to MongoDB.
- **Citizens (Users):** Can submit suspicious links/text and provide forensic evidence to community notes.
- **System (AI):** Aggregates and verifies data using advanced Chain-of-Thought (CoT) sentiment analysis.

---

## 🧠 Scoring Logic

Aegis relies on a deterministic mapping system to generate its final `Credibility Score`:

- **Groq REAL + Local REAL:** `90-100` (Authenticity Verified)
- **Groq REAL + Local FAKE:** `70-80` (Trusts the cloud engine, flags keyword mismatch)
- **Groq FAKE + Local REAL:** `20-30` (Cloud reasoning engine overrides innocent keywords)
- **Groq FAKE + Local FAKE:** `0-10` (Confirmed Manipulation)

*Note: Any score below 75 triggers a mandatory Citizen Review / Suspicious flag in the UI.*

---

## 🚧 Known Limitations & Edge Cases

In production AI engineering, no pipeline is 100% foolproof. The following are the structural breaking points of the current LLM architecture:

1. **The "Fake News" Temporal Blindspot (Knowledge Cutoffs)**
   - *The Failure:* Fast-breaking live events will be classified as FAKE because the Cloud Model relies on static pre-trained data and cannot find a record of it.
2. **The Sarcasm and Irony Paradox**
   - *The Failure:* The model lacks intent recognition. It treats harmless internet memes and political satire with the exact same severe "MANIPULATION DETECTED" badge as dangerous political lies.
3. **The "True But Malicious" Context Hack (Spinning)**
   - *The Failure:* A statement can be factually true (e.g., "The candidate was at the police station") but intentionally omits context (they were reporting a stolen car). A pure fact-checking pipeline clears it as authentic, missing the malicious spin.
4. **Symmetrical Disagreement Lock (Deadlocks)**
   - *The Failure:* A highly nuanced, unverified claim where both models have identical low confidence scores creates a binary classification deadlock instead of flagging it as "Unverifiable."

---

## 🚀 Future Roadmap

To address the **Temporal Blindspot**, the immediate next step for the Aegis pipeline is integrating a **Retrieval-Augmented Generation (RAG) Search API** (such as Tavily or Google Custom Search). By allowing the Cloud Engine to actively query the live web for breaking news sources before making a decision, the system will instantly verify real-time events that occurred after its pre-training cutoff date.

---

<div align="center">

*Project built for SE COMP FSD Submission 2025-2026.*

</div>
