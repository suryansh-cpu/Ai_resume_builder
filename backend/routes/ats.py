from fastapi import APIRouter, UploadFile, File, Body
import os
from backend.services.role_detect_and_score import detect_role_from_text, score_resume_for_role
from backend.services.extractor import extract_text_from_pdf
from backend.services.ats_checker import score_resume

router = APIRouter(prefix="/ats")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload & extract text from resume"""
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)

    return {"text": text}


@router.post("/score")
async def score_text(payload: dict = Body(...)):
    """
    POST /ats/score
    body: { "text": "..." , optional "role": "sde-1" }
    If role omitted, auto-detect it via Ollama (with fallback).
    """
    text = payload.get("text", "")
    role = payload.get("role")
    if not text:
        return {"error": "empty text"}

    if not role:
        role = detect_role_from_text(text)

    result = score_resume_for_role(text, role)
    # include returned role token as well
    result["role_token"] = role
    return result