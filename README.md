# 🛡️ JobFlow.ai - Intelligent Job Application Assistant

**JobFlow.ai** is a distributed system designed to bridge the gap between job browsing and application management. It combines a **Chrome Extension** for instant data extraction with a **MERN Stack Dashboard** powered by **Groq AI** to score resumes and track applications in real-time.

---
## 🚀 Live Demo: 
* [Demo Video](https://www.loom.com/share/887e1a1ce729484db489b1ae1624101a)
* [Live Link](https://job-flow-ai-3jyp.vercel.app/)

---

## 🚀 Key Features

### 🧩 Chrome Extension (The Bridge)
* **1-Click Job Scraping:** Automatically extracts job details (Title, Company, Location, Description) from LinkedIn and other job boards using custom DOM manipulation scripts.
* **Seamless Auth:** Shares authentication state with the web dashboard via `httpOnly` cookies.
* **Instant AI Insight:** Get a quick "Fit Check" directly on the job page before you even apply.

---

### 🧠 AI-Powered Analysis (The Brain)
* **Resume Scoring:** Uses **Groq (Llama 3-70B)** to semantically analyze your resume against specific job descriptions.
* **Gap Analysis:** Returns a 0-100 match score and identifies missing keywords or skills.
* **Structured Output:** AI responses are strictly formatted as JSON to ensure consistent UI rendering.

---

### 🛡️ Secure Authentication
* **Email/Password Authentication**
* **JWT-based Session Handling**
* **Secure Session Management:** Uses `httpOnly`, `Secure`, and `SameSite=None` cookies to prevent XSS attacks while allowing cross-origin requests from the extension.

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Lucide React, Context API |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **AI Engine** | Groq API (Llama 3-70B), Prompt Engineering |
| **Extension** | Manifest V3, Chrome Scripting API, Shadow DOM |
| **DevOps** | Render (Backend), Vercel (Frontend) |

---

## 🏗️ Architecture Highlights

### 1. Distributed Auth System
Instead of storing sensitive JWTs in LocalStorage (which is vulnerable to XSS), JobFlow uses a **HttpOnly Cookie** strategy.
* The **Frontend** and **Extension** both communicate with the Backend.
* The browser automatically attaches the secure cookie to requests from both origins.
* This ensures the Extension is always in sync with the Web Dashboard.

---

### 2. Robust Database Schema
* Designed to scale for high user volume.
* Optimized indexing for fast queries and efficient data retrieval.

---

### 3. Separation of Concerns
* The Extension uses isolated `useEffect` hooks: one for **Browser Interactions** (scraping the active tab) and another for **Network Requests** (checking auth status).
* Prevents race conditions and ensures a smooth user experience.

---

## 🏁 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Connection String
* Groq API Key
* Google OAuth Credentials

### 1. Clone the Repository
```bash
git clone [https://github.com/Aryan-404-404/JobFlow-AI.git](https://github.com/Aryan-404-404/JobFlow-AI.git)
cd JobFlow-ai
```
### 2. Setup Backend
```bash
cd server
npm install
```
Create a .env file in the server folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
NODE_ENV=development
```
Run the server:
```bash
npm start
```
### 3. Setup Frontend
```bash
cd ../client
npm install
```
Create a .env file in the client folder:
```bash
VITE_API_URL=http://localhost:5000
```
Run the frontend:
```bash
npm run dev
```
### 4. Load the Extension
* Go to chrome://extensions/ in your browser.
* Toggle Developer mode (top right).
* Click Load unpacked.
* Select the extension/dist folder (make sure to run npm run build inside extension first!).

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author
### Aryan
[LinkedIn](https://www.linkedin.com/in/aryan-599443271/)

[GitHub](https://github.com/Aryan-404-404)
