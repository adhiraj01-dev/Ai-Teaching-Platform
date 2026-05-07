"""
Pydantic models for all API request and response bodies.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class Difficulty(str, Enum):
    beginner     = "beginner"
    intermediate = "intermediate"
    advanced     = "advanced"
    eli5         = "eli5"


# ── /explain ────────────────────────────────────────────────
class ExplainRequest(BaseModel):
    topic:      str        = Field(..., min_length=1, max_length=300)
    difficulty: Difficulty = Difficulty.beginner


class ExampleModel(BaseModel):
    title:   str
    content: str
    code:    Optional[str] = ""


class ExplainResponse(BaseModel):
    definition: str
    steps:      List[str]
    example:    ExampleModel
    summary:    str
    tags:       List[str]
    difficulty: str


# ── /quiz ────────────────────────────────────────────────────
class QuizRequest(BaseModel):
    topic:      str        = Field(..., min_length=1, max_length=300)
    difficulty: Difficulty = Difficulty.beginner


class QuizQuestion(BaseModel):
    question:    str
    options:     List[str]  # 4 options
    answer:      int         # 0-indexed correct option
    explanation: str


class QuizResponse(BaseModel):
    topic:     str
    questions: List[QuizQuestion]


# ── /notes ───────────────────────────────────────────────────
class NotesRequest(BaseModel):
    topic:       str        = Field(..., min_length=1, max_length=300)
    explanation: dict       # raw explanation JSON from /explain
    difficulty:  Difficulty = Difficulty.beginner


class NotesResponse(BaseModel):
    topic:      str
    notes:      str
    difficulty: str


# ── /doubt ───────────────────────────────────────────────────
class DoubtRequest(BaseModel):
    question:   str        = Field(..., min_length=1, max_length=500)
    topic:      str        = Field(..., min_length=1, max_length=300)
    difficulty: Difficulty = Difficulty.beginner


class DoubtResponse(BaseModel):
    question: str
    answer:   str
    topic:    str


# ── /voice ───────────────────────────────────────────────────
class VoiceRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class VoiceResponse(BaseModel):
    status:  str
    message: str
