# EduAI — AI Explain Like Teacher System

A production-ready, full-stack interactive teaching platform powered by Claude AI.

```
┌─────────────────────────────────────────────────────────────┐
│  React + Vite + Tailwind + Framer Motion  (frontend :3000)  │
│  FastAPI + Anthropic Claude               (backend  :8000)  │
└─────────────────────────────────────────────────────────────┘
```

## Features

| Feature | Description |
|---|---|
| Explain Topic | Structured AI explanations: Definition → Steps → Example → Summary |
| Difficulty Modes | Beginner / Intermediate / Advanced / ELI5 |
| Auto Quiz | 4 MCQ questions with scoring and answer explanations |
| Smart Notes | Condensed study notes with PDF + TXT download |
| Whiteboard | Full HTML5 canvas with pen, arrows, shapes, text |
| Voice Mode | Text-to-speech + Speech-to-text (Web Speech API) |
| Doubt System | Contextual follow-up Q&A after every explanation |
| Dashboard | Recharts progress tracking: scores, XP, topics |

## Project Structure

```
eduai-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── ExplanationCard.jsx
│   │   │   ├── DoubtBox.jsx
│   │   │   ├── DifficultyPicker.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/
│   │   │   ├── ExplainPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   ├── WhiteboardPage.jsx
│   │   │   ├── VoicePage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── context/AppContext.jsx
│   │   ├── utils/api.js
│   │   ├── utils/pdfExport.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── api/
│   │   ├── routes.py
│   │   ├── models.py
│   │   ├── prompts.py
│   │   └── claude_service.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Anthropic API key → https://console.anthropic.com

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env → set ANTHROPIC_API_KEY=sk-ant-...
uvicorn main:app --reload --port 8000
```

Swagger docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

## Docker (One Command)

```bash
echo "ANTHROPIC_API_KEY=sk-ant-your-key" > backend/.env
docker-compose up --build
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/explain` | Structured topic explanation |
| POST | `/quiz` | MCQ quiz generation |
| POST | `/notes` | Study notes generation |
| POST | `/doubt` | Follow-up question answer |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |

### Example

```bash
curl -X POST http://localhost:8000/explain \
  -H "Content-Type: application/json" \
  -d '{"topic": "Binary Search", "difficulty": "beginner"}'
```

## Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | — |
| `HOST` | No | `0.0.0.0` |
| `PORT` | No | `8000` |

## Customization

- **Change model**: Edit `MODEL` in `backend/api/claude_service.py`
- **Edit prompts**: All prompts in `backend/api/prompts.py`
- **Add topics**: Edit `SUGGESTIONS` in `frontend/src/pages/ExplainPage.jsx`

## Deploy

- Frontend → Vercel (`npm run build` → deploy `dist/`)
- Backend → Railway / Render / Fly.io (set `ANTHROPIC_API_KEY` env var)
