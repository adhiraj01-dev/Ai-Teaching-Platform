"""
FastAPI route handlers for all EduAI endpoints.
Each route calls the Claude service and validates the response.
"""
from fastapi import APIRouter, HTTPException
from .models import (
    ExplainRequest, ExplainResponse, ExampleModel,
    QuizRequest, QuizResponse, QuizQuestion,
    NotesRequest, NotesResponse,
    DoubtRequest, DoubtResponse,
    VoiceRequest, VoiceResponse,
)
from .claude_service import ask_claude, ask_claude_json
from .prompts import explain_system, quiz_system, notes_system, doubt_system
import json

router = APIRouter()


# ── /explain ─────────────────────────────────────────────────
@router.post("/explain", response_model=ExplainResponse)
async def explain(req: ExplainRequest):
    """
    Generate a structured explanation for any topic.
    Returns definition, steps, example, summary, and tags.
    """
    try:
        data = await ask_claude_json(
            system=explain_system(req.difficulty.value),
            user=f"Explain this topic: {req.topic}",
            max_tokens=1500,
        )

        # Validate and coerce the response
        return ExplainResponse(
            definition=str(data.get("definition", "")),
            steps=[str(s) for s in data.get("steps", [])],
            example=ExampleModel(
                title=str(data.get("example", {}).get("title", req.topic)),
                content=str(data.get("example", {}).get("content", "")),
                code=str(data.get("example", {}).get("code", "")),
            ),
            summary=str(data.get("summary", "")),
            tags=[str(t) for t in data.get("tags", [])],
            difficulty=req.difficulty.value,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── /quiz ─────────────────────────────────────────────────────
@router.post("/quiz", response_model=QuizResponse)
async def quiz(req: QuizRequest):
    """
    Generate 4 MCQ questions with answers and explanations.
    """
    try:
        data = await ask_claude_json(
            system=quiz_system(req.difficulty.value),
            user=f"Generate quiz questions for: {req.topic}",
            max_tokens=1500,
        )

        # data should be a list of questions
        if not isinstance(data, list):
            raise ValueError("Expected a JSON array of questions")

        questions = []
        for q in data[:5]:  # max 5 questions
            questions.append(QuizQuestion(
                question=str(q.get("question", q.get("q", ""))),
                options=[str(o) for o in q.get("options", [])],
                answer=int(q.get("answer", 0)),
                explanation=str(q.get("explanation", "")),
            ))

        return QuizResponse(topic=req.topic, questions=questions)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── /notes ───────────────────────────────────────────────────
@router.post("/notes", response_model=NotesResponse)
async def notes(req: NotesRequest):
    """
    Generate concise study notes from an explanation.
    Returns plain text formatted with ## section headers.
    """
    try:
        explanation_summary = json.dumps({
            "definition": req.explanation.get("definition", ""),
            "steps": req.explanation.get("steps", []),
            "example": req.explanation.get("example", {}),
            "summary": req.explanation.get("summary", ""),
        })

        raw = await ask_claude(
            system=notes_system(req.difficulty.value),
            user=f"Create study notes for: {req.topic}\n\nBased on this explanation:\n{explanation_summary}",
            max_tokens=1000,
        )

        return NotesResponse(
            topic=req.topic,
            notes=raw.strip(),
            difficulty=req.difficulty.value,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── /doubt ───────────────────────────────────────────────────
@router.post("/doubt", response_model=DoubtResponse)
async def doubt(req: DoubtRequest):
    """
    Answer a follow-up question in context of the current topic.
    """
    try:
        raw = await ask_claude(
            system=doubt_system(req.topic, req.difficulty.value),
            user=req.question,
            max_tokens=500,
        )

        return DoubtResponse(
            question=req.question,
            answer=raw.strip(),
            topic=req.topic,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


# ── /voice (TTS handled by browser Web Speech API) ───────────
@router.post("/voice", response_model=VoiceResponse)
async def voice(req: VoiceRequest):
    """
    Voice endpoint — TTS is handled client-side via the Web Speech API.
    This endpoint exists for future server-side TTS integration.
    """
    return VoiceResponse(
        status="ok",
        message="TTS is handled client-side via the Web Speech API. Text received on server.",
    )


# ── /progress (in-memory placeholder) ───────────────────────
@router.get("/progress")
async def progress():
    """
    Returns placeholder progress data.
    In production, this would query a database per user session.
    """
    return {
        "topics_learned": 0,
        "quizzes_taken":  0,
        "avg_score":      0,
        "xp":             0,
        "message": "Progress is tracked client-side. Connect a database for persistence.",
    }


# ── /health ──────────────────────────────────────────────────
@router.get("/health")
async def health():
    return {"status": "ok", "service": "EduAI Backend"}
