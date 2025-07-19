# BorderPass Questionnaire

A hypermodern, responsive questionnaire app built with Next.js, TypeScript, Tailwind, and Groq AI. Designed with simplicity, extensibility, and high user experience in mind—fully meeting and exceeding the BorderPass technical assessment requirements.

## 🚀 Live Demo

> [https://borderpass-questionnaire.vercel.app](https://borderpass-questionnaire.vercel.app)

---

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion + GSAP
- **AI Integration**: Groq (LLaMA 3)
- **UI Library**: shadcn/ui

---

## 🎯 Assignment Coverage

| Requirement                       | Status        |
|----------------------------------|---------------|
| One-question-per-page UI         | ✅ Implemented |
| JSON-driven questions            | ✅ Dynamic import |
| NEXT/BACK navigation             | ✅ With state memory |
| Optional & required fields       | ✅ With validation logic |
| Multiple input types             | ✅ 7 types supported |
| Submission to mock API          | ✅ via Next.js API routes |
| Component library usage          | ✅ shadcn/ui |
| Bonus TypeScript implementation  | ✅ Fully typed |
| Error handling & feedback        | ✅ Custom UI with fallback logic |

---

## ✨ Features

### Core
- **Per-Page Navigation** – Smooth transitions with state retention
- **Dynamic Input Rendering** – Supports text, radio, checkbox, rating, and more
- **Validation Engine** – Visual error handling for required fields
- **Responsive Layout** – Mobile-first, cross-browser compatible

### Enhancements
- **Groq-Powered AI Assistant** – Context-aware support for any question
- **Animated UX** – Micro-interactions and full-page transitions
- **Progress Tracker** – Live progress indicator
- **AI Summary View** – Auto-generated recap at submission
- **Quick Reply Buttons** – AI-suggested responses

---

## 📦 Project Structure

```
borderpass-questionnaire/
├── app/                      # App router structure
│   ├── api/chat/route.ts     # Groq chat integration (mock API)
│   ├── layout.tsx            # App shell and font config
│   └── page.tsx              # Entry page
├── components/               # UI + feature components
│   ├── survey-container.tsx
│   ├── ai-assistant.tsx
│   ├── animated-question.tsx
│   └── submission-summary.tsx
├── data/questions.json       # Questionnaire config
├── lib/                      # Types and utilities
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🧪 Validation Logic

```ts
const validateQuestion = (question: Question, value: any): boolean => {
  if (!question.required) return true;
  switch (question.type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'checkbox':
      return Array.isArray(value) && value.length > 0;
    case 'rating':
      return value > 0;
    default:
      return value?.toString().trim().length > 0;
  }
};
```

---

## 🤖 AI Integration

Context-aware support is powered by Groq LLaMA 3. The assistant dynamically adjusts to the current question context (e.g., names, emails, ratings), generating intelligent clarifications in real-time.

```ts
const result = await streamText({
  model: groq("llama3-8b-8192"),
  system: createContextualSystemPrompt(currentQuestion, responses),
  messages,
  temperature: 0.7,
});
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- Groq API key (for AI assistant)

### Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/borderpass-questionnaire.git
cd borderpass-questionnaire
npm install
cp .env.example .env.local
# Add your GROQ_API_KEY
npm run dev
```

---

## 🧭 Future Work

- Offline support via service workers
- Conditional logic per user input
- Admin dashboard to manage questions
- i18n support for multilingual surveys

---

**Built for the BorderPass technical challenge by [Yair](https://yair.ca)**
