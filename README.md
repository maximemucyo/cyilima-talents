# Cyilima Talents - AI-Powered Recruitment Platform

Cyilima Talents is a state-of-the-art recruitment and talent management platform built for **Umurava**. It leverages AI to streamline the screening process, enabling recruiters to identify top talent with unprecedented speed and precision.

## 🚀 Key Features

- **AI-Powered Screening**: Automates the evaluation of candidates against job descriptions using Gemini 3.1 Flash.
- **Smart Resume Parsing**: Extracts structured talent profiles from raw resume text (PDF/DOCX).
- **Recycle Bin System**: Comprehensive data lifecycle management with soft-delete and restoration capabilities.
- **Rwanda-Centric Focus**: Tailored features for the local market, including specific location tracking and localized job categories.
- **Premium UI/UX**: A modern, responsive dashboard with a dark-mode first aesthetic and fluid animations.

## 🏗 Architecture Overview

The platform is built on a modern full-stack architecture:

- **Frontend**: Next.js 15+ (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Next.js Route Handlers (Serverless), MongoDB (Mongoose).
- **AI Engine**: Google Gemini 3.1 Flash Lite (via @google/genai).
- **Authentication**: NextAuth.js (Auth.js v5).

## 🤖 AI Decision Flow

1.  **Extraction**: Raw resume text is processed by Gemini to extract structured fields (skills, experience, education).
2.  **Context Loading**: When a screening is triggered, the AI receives both the Job Post requirements and the extracted Candidate Profiles.
3.  **Weighted Evaluation**: The AI applies a weighted scoring algorithm:
    -   **Technical Skills (40%)**
    -   **Experience (30%)**
    -   **Education (15%)**
    -   **Relevance/Potential (15%)**
4.  **Ranking & Recommendation**: Candidates are ranked by score and categorized into *Shortlist*, *Review*, or *Reject*.
5.  **Reasoning**: For every decision, the AI generates a professional, recruiter-friendly natural language explanation.

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or local)
- Google Gemini API Key

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/maximemucyo/cyilima-talents.git
    cd cyilima-talents
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_uri
    GEMINI_API_KEY=your_gemini_api_key
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 📝 Assumptions & Limitations

- **Resume Format**: The AI parser works best with standard professional resume layouts. Highly graphical or unconventional CVs may result in lower extraction accuracy.
- **Data Retention**: Soft-deleted items in the Recycle Bin are currently persisted indefinitely unless manually purged.
- **Authentication**: Basic Role-Based Access Control (RBAC) is implemented for Admin and Recruiter roles.

## 📜 License
Umurava Hackathon 2026 - All Rights Reserved.
