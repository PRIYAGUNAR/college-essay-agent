# Maya — College Essay Agent 🎓

> A story archaeologist, not an essay writer.

## The Big Idea

Most college essay tools write essays for students. Maya does something different — she **excavates the story that's already inside the student** and then writes an essay that sounds exactly like them.

## What Makes This Different

| What others build | What Maya does |
|---|---|
| ChatGPT wrapper | Structured 5-stage storytelling system |
| Generic essay output | Voice-matched, school-specific drafts |
| One-shot generation | Iterative coaching with revision studio |
| Forgettable UI | Feels like a $500/hr counselor |

## Key Features

- **5-Stage Interview Engine** — Welcome → Intake → Dig Deep → Story Lock → Essay
- **Cliche Radar** — AI detects overused topics and suggests better angles
- **Small Moment Detector** — Finds hidden story gold with uniqueness scores
- **Voice Analyzer** — Detects student writing style after 3 messages
- **School DNA Matching** — Tailors story angle to each university's culture
- **Essay Studio** — Generate, revise, score, export in one place
- **7 Common App Prompts** — Full prompt selector built in
- **Essay Strength Meter** — 5-dimension quality scoring with feedback

## Tech Stack

- **Backend:** Python + FastAPI + Groq (llama-3.3-70b-versatile)
- **Frontend:** React + Vite
- **Deploy:** Railway + Vercel

## Live Demo

- Frontend: https://college-essay-agent.vercel.app
- Backend: https://your-railway-url.up.railway.app

## Run Locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Built in 15 days by Guna
