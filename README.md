# AI Visa Success Advisor

A production-grade, full-stack platform designed to mitigate visa rejections for international students through data-driven analysis and document-aware AI guidance.

---

## 🚀 Project Overview

The **AI Visa Success Advisor** addresses the critical challenges students face during the visa application process, such as unstructured data and weak Statements of Purpose (SOP). By leveraging a **Dual-Intelligence Layer**, the system provides objective scoring, reasoning factors, and actionable improvement suggestions.

* **Objective**: To provide students with a validated application process and pre-interview feedback.
* **Methodology**: Utilizes a structured approach to ensure application success.
* **Key Deliverable**: A professional dashboard featuring exportable PDF reports with prioritized improvements.

---

## 🛠️ Technical Stack

### **Frontend**
* **React (Vite)**: Powering a high-performance, single-page application (SPA) experience.
* **Tailwind CSS**: Used for a clean, modern, and responsive UI.
* **jsPDF**: Facilitates the persistence and export of analysis reports.

### **Backend**
* **Node.js & Express**: Handles core business logic, user authentication, and MongoDB CRUD operations.
* **Python (FastAPI)**: Manages the AI layer, integrating seamlessly with LLM SDKs and data science libraries.
* **MongoDB**: Provides a flexible NoSQL database for storing user application data and chat histories.

### **AI & Models**
* **Gemini 2.5 Flash**: Optimized for high-speed processing of multi-section form data and generating structured JSON analysis.
* **Gemini 1.5 Flash**: Powers the context-aware "Advisor Mode," utilizing a large context window for document review.

---

## 🧠 System Architecture

### **Dual-Intelligence Layer**
The system splits AI responsibilities to ensure both speed and depth:
1.  **Form Analysis**: Processes raw application data to provide a success percentage and weighted reasoning factors such as Financial Proof and Home Country Ties.
2.  **Chat Advisor**: An interactive mode where the AI "reads" uploaded documents to provide grounded, context-aware feedback.

### **Optimization & Fine-Tuning**
* **Serialization**: Complex visa application structures were flattened into serialized tokens to ensure models adhere to strict JSON schemas.
* **Reference Corpora**: The system is grounded in proven success patterns by referencing curated directories of "Good" and "Bad" SOPs.

---

## 🔒 Security & Data Integrity

* **Authentication**: Implements JWT-based security, requiring a valid token for all API requests to both backends.
* **Data Isolation**: Every database query includes a strict ownership filter (searching by `user_id`) to ensure absolute user privacy.
* **Production Roadmap**: Currently utilizes `localStorage` for the prototype phase, with a plan to transition to `httpOnly` cookies for enhanced hardening.

---

## 📂 Project Structure

* **Monorepo**: A unified codebase containing the React frontend, Node.js core service, and Python AI service for independent scaling and efficient development.

---

**Developers**: Shlok Jain, Bhumi Upade, and Abhishek Chuttugulla
