# Aegis Intel: Deepfake & Misinformation Forensic Engine

## 📖 Project Overview
Aegis Intel is a comprehensive forensic engine designed to detect deepfakes, AI-generated propaganda, and misinformation. Built to address the challenges of digital deception during high-stakes situations (such as conflicts), it bridges the gap between automated AI detection and nuanced human context. 

When AI models encounter "Forensic Uncertainty," the platform leverages a secure "Citizen Review" feed where users can provide factual evidence. A LLaMA-based NLP model (via Groq) then analyzes the community consensus to generate a definitive, reliable sentiment report.

## 🎥 Demo Video & Presentation Slides
> **[Google Drive Link - Demo Video & PPT Slides](https://drive.google.com/drive/folders/1_AXP4Najmk-FtxfUqTGZ-Jrb5Pw-Uiqq?usp=sharing)**
> *Note: This Google Drive folder contains both the project demo video and the presentation slides.*

## 💻 Technologies Used
* **Frontend:** React.js, Vite, Vanilla CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Machine Learning / AI:** LLaMA Cloud API via Groq SDK
* **Authentication:** JWT (JSON Web Tokens)

## ⚙️ Setup Instructions

To run this project locally, you will need to start three separate servers (Frontend, Backend, and ML Service).

### 1. Prerequisites
* Node.js (v16+)
* Python (v3.8+)
* MongoDB Atlas Cluster (or local MongoDB)

### 2. Backend Setup (Node.js)
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory with:
```env
PORT=5005
MONGODB_URI=your_mongodb_connection_string
```
Start the server:
```bash
node server.js
```

### 3. Frontend Setup (React/Vite)
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```

### 4. ML Service Setup (Python)
```bash
cd ml_service
pip install -r requirements.txt
```
Create a `.env` file in the `ml_service/` directory with:
```env
HUGGING_FACE_TOKEN=your_huggingface_api_token
```
Start the Python server:
```bash
python app.py
```

## 🤝 Stakeholders & Access Control
* **Citizens (Users):** Can submit suspicious links/text and provide forensic evidence to community notes.
* **System (AI):** Aggregates and verifies data using LLaMA sentiment analysis.

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

## 🚀 Future Roadmap

To address the **Temporal Blindspot**, the immediate next step for the Aegis pipeline is integrating a **Retrieval-Augmented Generation (RAG) Search API** (such as Tavily or Google Custom Search). By allowing the Cloud Engine to actively query the live web for breaking news sources before making a decision, the system will instantly verify real-time events that occurred after its pre-training cutoff date.

*Project built for SE COMP FSD Submission 2025-2026.*
