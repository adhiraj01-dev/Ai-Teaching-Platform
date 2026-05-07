"""
EduAI — FastAPI backend entry point.

Run with:
    uvicorn main:app --reload --port 8000
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.routes import router

# Load environment variables from .env
load_dotenv()

app = FastAPI(
    title="EduAI API — by Adhiraj",
    description="AI-powered teaching platform backend. Built by Adhiraj.",
    version="1.0.0",
    docs_url="/docs",       # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────
# Allow the Vite frontend dev server and any production origin
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────
app.include_router(router, prefix="")

# ── Root ─────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "service": "EduAI Backend",
        "version": "1.0.0",
        "endpoints": ["/explain", "/quiz", "/notes", "/doubt", "/voice", "/progress", "/health"],
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
