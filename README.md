# MockMate — AI-Powered Interview Simulator

MockMate is a full-stack, AI-integrated application that allows users to practice realistic job interviews using TTS-based simulation and receive structured AI feedback.

### Round 2 Status (Functional Prototype - 80% Complete)

* **Core Functionality Working:** The end-to-end flow from user input (Resume/JD) to final structured feedback is complete.
* **Realistic Simulation (TTS):** The interview simulation is currently implemented using sequential question display and **Text-to-Speech (TTS)** audio.

---

## 2. Architecture Overview

MockMate employs a decoupled, serverless architecture that separates the user interface and authentication from the complex AI processing.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend / API Gateway** | Next.js 14, TypeScript, Tailwind | UI rendering, API routing, and orchestration. |
| **Database / BaaS** | Convex | Real-time database storing users, interview records, questions, and final feedback. |
| **AI Workflow Engine** | n8n | Executes multi-step AI pipelines for generating questions and analyzing transcripts. |
| **Authentication** | Clerk | Handles Auth, User Sessions, and integrated Subscription Billing. |
| **Security + Utils** | ArcJet, ImageKit | Rate limiting enforcement and cloud storage for resume files. |

For detailed documentation, see:
* [**📁 docs/01\_Architecture\_Overview.md**](docs/01_Architecture_Overview.md)

---

## 3. List of Dependencies

| Category | Packages |
| :--- | :--- |
| **Framework** | `next`, `react`, `react-dom` |
| **Database** | `convex`, `@convex-dev/react`, `axios` |
| **Auth + UI** | `@clerk/nextjs`, `tailwindcss`, `shadcn/ui` |
| **Security/Utils** | `@arcjet/next`, `arcjet`, `imagekit` |

---

## 4. Setup Instructions

### Prerequisites

* Node.js (v18+) and npm/yarn/pnpm.


## 5. How to Run Locally

### Minimal Run (Evaluation)

This method quickly runs the frontend, connecting to the pre-configured deployed Convex instance.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dhruvkdev/mockmate.git
    cd mockmate
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment:**
    ```bash
    cp .env.example .env.local
    # Paste test keys
    ```
4.  **Start the dev server:**
    ```bash
    npm run dev
    ```
App runs at: 👉 **http://localhost:3000**

### Full Local Development Setup (Recommended for Active Development)

To actively develop and test changes in the Convex backend functions, you must run the local Convex server alongside the Next.js app.

1.  **Terminal 1 (Convex Backend):** Run the Convex development server. This syncs local changes in `convex/*.ts` to a local database instance.

    ```bash
    npx convex dev
    ```

2.  **Terminal 2 (Next.js Frontend):** Run the Next.js application (as above).

    ```bash
    npm run dev
    ```
By running both, all frontend calls hit your local Convex development environment.

---

## 6. APIs or Endpoints

### Next.js API Routes (Orchestration)

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/generate-interview-questions` | `POST` | Triggers the AI Q\&A workflow via n8n, handling ImageKit upload and ArcJet limits. |
| `/api/generate-feedback` | `POST` | Sends the recorded interview transcript to the n8n workflow for final scoring and analysis. |

### Convex Backend Functions (Data Layer)

| Function | Type | Description |
| :--- | :--- | :--- |
| `Interview:saveInterviewQuestions` | Mutation | Saves the generated questions and metadata to the database. |
| `Interview:updateFeedback` | Mutation | Stores the final structured feedback (rating, suggestions). |

---

## 7. Example Inputs/Outputs

### Request to generate questions (Job Description Path)

```json
{
  "jobTitle": "Senior React Developer",
  "jobDescription": "Must have 5+ years experience building scalable React apps with Next.js and TypeScript."
}
Output Example (AI Feedback - Stored in Convex feedback field)
JSON

{
  "feedback": {
    "rating": 7.8,
    "feedback": "The candidate was technically accurate regarding state management but lacked depth in explaining server-side rendering benefits in Next.js. Speaking pace was too fast in the final minute.",
    "suggestion": [
      "Practice articulating the difference between Client and Server Components.",
      "Maintain a slower, more deliberate speaking pace under pressure."
    ]
  }
}

Markdown

# 📘 MockMate — AI-Powered Interview Simulator

## 1. Project Overview

MockMate is a full-stack, AI-integrated application that allows users to practice realistic job interviews using TTS-based simulation and receive structured AI feedback. The application progresses the user through interview generation, simulation, and post-session AI feedback.

### Round 2 Status (Functional Prototype - 80% Complete)

* **Core Functionality Working:** The end-to-end flow from user input (Resume/JD) to final structured feedback is complete.
* **Realistic Simulation (TTS):** The interview simulation is currently implemented using sequential question display and **Text-to-Speech (TTS)** audio.

---

## 2. Architecture Overview

MockMate employs a decoupled, serverless architecture that separates the user interface and authentication from the complex AI processing.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend / API Gateway** | Next.js 14, TypeScript, Tailwind | UI rendering, API routing, and orchestration. |
| **Database / BaaS** | Convex | Real-time database storing users, interview records, questions, and final feedback. |
| **AI Workflow Engine** | n8n | Executes multi-step AI pipelines for generating questions and analyzing transcripts. |
| **Authentication** | Clerk | Handles Auth, User Sessions, and integrated Subscription Billing. |
| **Security + Utils** | ArcJet, ImageKit | Rate limiting enforcement and cloud storage for resume files. |

For detailed documentation, see:
* [**📁 docs/01\_Architecture\_Overview.md**](docs/01_Architecture_Overview.md)

---

## 3. List of Dependencies

| Category | Packages |
| :--- | :--- |
| **Framework** | `next`, `react`, `react-dom` |
| **Database** | `convex`, `@convex-dev/react`, `axios` |
| **Auth + UI** | `@clerk/nextjs`, `@clerk/themes` |
| **Security/Utils** | `@arcjet/next`, `arcjet`, `imagekit` |

---

## 4. Setup Instructions

### Prerequisites

* Node.js (v18+) and npm/yarn/pnpm.

### Environment Variables (`.env.local`)

Create a `.env.local` file and populate it with the absolute minimum keys required.

Clerk Keys (Mandatory for Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_... CLERK_SECRET_KEY=sk_...

Convex Key (Mandatory for Data Fetching)
NEXT_PUBLIC_CONVEX_URL="https://...convex.cloud"

NOTE: Keys for ArcJet, ImageKit, and n8n are utilized for full functionality but are optional for a basic local development run.

---

## 5. How to Run Locally

### Minimal Run (Evaluation)

This method quickly runs the frontend, connecting to the pre-configured deployed Convex instance.

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd mockmate
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment:**
    ```bash
    cp .env.example .env.local
    # Paste test keys
    ```
4.  **Start the dev server:**
    ```bash
    npm run dev
    ```
App runs at: 👉 **http://localhost:3000**

### Full Local Development Setup (Recommended for Active Development)

To actively develop and test changes in the Convex backend functions, you must run the local Convex server alongside the Next.js app.

1.  **Terminal 1 (Convex Backend):** Run the Convex development server. This syncs local changes in `convex/*.ts` to a local database instance.

    ```bash
    npx convex dev
    ```

2.  **Terminal 2 (Next.js Frontend):** Run the Next.js application (as above).

    ```bash
    npm run dev
    ```
By running both, all frontend calls hit your local Convex development environment.

---

## 6. APIs or Endpoints

### Next.js API Routes (Orchestration)

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/generate-interview-questions` | `POST` | Triggers the AI Q\&A workflow via n8n, handling ImageKit upload and ArcJet limits. |
| `/api/generate-feedback` | `POST` | Sends the recorded interview transcript to the n8n workflow for final scoring and analysis. |

### Convex Backend Functions (Data Layer)

| Function | Type | Description |
| :--- | :--- | :--- |
| `Interview:saveInterviewQuestions` | Mutation | Saves the generated questions and metadata to the database. |
| `Interview:updateFeedback` | Mutation | Stores the final structured feedback (rating, suggestions). |

---

## 7. Deployment (Optional but Recommended)
Live Demo:
🔗 https://mockmate-pokh.vercel.app/

## 8. Contributors
Dhruv Kumar

Swarup Das

Anurag Sharma

Nibir Deka