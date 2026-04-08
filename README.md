# AI Visa Success Advisor

[cite_start]A production-grade, full-stack platform designed to mitigate visa rejections for international students through data-driven analysis and document-aware AI guidance[cite: 6, 7].

---

## 🚀 Project Overview

[cite_start]The **AI Visa Success Advisor** addresses the critical challenges students face during the visa application process, such as unstructured data and weak Statements of Purpose (SOP)[cite: 6]. [cite_start]By leveraging a **Dual-Intelligence Layer**, the system provides objective scoring, reasoning factors, and actionable improvement suggestions[cite: 9, 10].

* [cite_start]**Objective**: To provide students with a validated application process and pre-interview feedback[cite: 7].
* [cite_start]**Methodology**: Utilizes a structured approach to ensure application success[cite: 7, 10].
* [cite_start]**Key Deliverable**: A professional dashboard featuring exportable PDF reports with prioritized improvements[cite: 10].

---

## 🛠️ Technical Stack

### **Frontend**
* [cite_start]**React (Vite)**: Powering a high-performance, single-page application (SPA) experience[cite: 8, 46].
* [cite_start]**Tailwind CSS**: Used for a clean, modern, and responsive UI[cite: 46].
* [cite_start]**jsPDF**: Facilitates the persistence and export of analysis reports[cite: 46].

### **Backend**
* [cite_start]**Node.js & Express**: Handles core business logic, user authentication, and MongoDB CRUD operations[cite: 8, 21, 47].
* [cite_start]**Python (FastAPI)**: Manages the AI layer, integrating seamlessly with LLM SDKs and data science libraries[cite: 8, 22, 48].
* [cite_start]**MongoDB**: Provides a flexible NoSQL database for storing user application data and chat histories[cite: 47].

### **AI & Models**
* [cite_start]**Gemini 2.5 Flash**: Optimized for high-speed processing of multi-section form data and generating structured JSON analysis[cite: 13, 16].
* [cite_start]**Gemini 1.5 Flash**: Powers the context-aware "Advisor Mode," utilizing a large context window for document review[cite: 15, 44].

---

## 🧠 System Architecture

### **Dual-Intelligence Layer**
The system splits AI responsibilities to ensure both speed and depth:
1.  [cite_start]**Form Analysis**: Processes raw application data to provide a success percentage and weighted reasoning factors such as Financial Proof and Home Country Ties[cite: 14, 37].
2.  [cite_start]**Chat Advisor**: An interactive mode where the AI "reads" uploaded documents to provide grounded, context-aware feedback[cite: 42, 44].

### **Optimization & Fine-Tuning**
* [cite_start]**Serialization**: Complex visa application structures were flattened into serialized tokens to ensure models adhere to strict JSON schemas[cite: 16, 40].
* [cite_start]**Reference Corpora**: The system is grounded in proven success patterns by referencing curated directories of "Good" and "Bad" SOPs[cite: 26, 27].

---

## 🔒 Security & Data Integrity

* [cite_start]**Authentication**: Implements JWT-based security, requiring a valid token for all API requests to both backends[cite: 30].
* [cite_start]**Data Isolation**: Every database query includes a strict ownership filter (searching by `user_id`) to ensure absolute user privacy[cite: 31].
* [cite_start]**Production Roadmap**: Currently utilizes `localStorage` for the prototype phase, with a plan to transition to `httpOnly` cookies for enhanced hardening[cite: 32, 34].

---

## 📂 Project Structure

* [cite_start]**Monorepo**: A unified codebase containing the React frontend, Node.js core service, and Python AI service for independent scaling and efficient development[cite: 20, 49].

---

**Developers**: Shlok Jain, Bhumi Upade, and Abhishek Chuttugulla
