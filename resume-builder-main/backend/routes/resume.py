from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.enhance import enhance_text
from backend.services.resume_questions import QUESTIONS
from backend.services.resume_session import start_session, save_answer, get_session
from fastapi.responses import StreamingResponse
from io import BytesIO
from backend.services.resume_structure import structure_resume_text
from backend.services.resume_pdf import generate_pdf_resume
from backend.services.pdf_generator import generate_pdf_from_html
# from services.resume_pdf import generate_resume_pdf
router = APIRouter(prefix="/resume", tags=["Resume Builder"])

class Answer(BaseModel):
    question: str
    answer: str

class ResumeRequest(BaseModel):
    role: str
    answers: list[Answer]

router = APIRouter(prefix="/resume", tags=["resume"])

@router.get("/start")
def start():
    """
    Start a new resume session.
    Returns: { session_id, question_index, question_text }
    """
    session_id = start_session()
    return {
        "session_id": session_id,
        "question_index": 0,
        "question": QUESTIONS[0],
        "total_questions": len(QUESTIONS),
        "message": "Answer this question and then call /resume/next (will implement next)."
    }
@router.post("/next")
def next_question(payload: dict):
    session_id = payload.get("session_id")
    answer = payload.get("answer")

    session = get_session(session_id)
    if not session:
        return {"error": "Invalid session_id"}

    index = session["current_index"]

    # Save the user answer
    save_answer(session_id, answer)

    # If all questions are answered
    if index + 1 >= len(QUESTIONS):
        return {
            "done": True,
            "message": "All questions completed. Call /resume/generate to build resume."
        }

    # Otherwise return next question
    return {
        "done": False,
        "session_id": session_id,
        "question_index": index + 1,
        "question": QUESTIONS[index + 1]
    }
@router.post("/generate")
def generate_resume(data: ResumeRequest):
    # 1️⃣ Structure raw answers (NO AI here)
    structured_resume = structure_resume_text(
        [{"question": a.question, "answer": a.answer} for a in data.answers],
        data.role
    )

    # 2️⃣ ONE AI call for full resume
    prompt = f"""
    You are a professional resume writer.

    Improve the resume below.
    Rules:
    - Do NOT invent information
    - Keep content factual
    - Use strong bullet points
    - ATS-friendly language
    - One page only

    RESUME DATA:
    {structured_resume}
    """

    final_resume = enhance_text(str(structured_resume), data.role)

    return {
        "role": data.role,
        "resume": final_resume
    }



@router.post("/pdf")
def pdf_resume(data: dict):
    

    session_id = data.get("session_id")
    role = data.get("role")

    session = get_session(session_id)
    if not session:
        return {"error": "Invalid session_id"}

    answers = session["answers"]

    # Structured resume
    structured = structure_resume_text(answers, role)

    # Generate PDF
    pdf_bytes = generate_pdf_from_html(structured)

    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )




# @router.post("/pdf")
# def download_pdf(data: dict):
#     session_id = data.get("session_id")
#     role = data.get("role")

#     # 1️⃣ get answers
#     session = get_session(session_id)
#     if not session:
#         return {"error": "Invalid session_id"}

#     answers = session["answers"]

#     # 2️⃣ get structured text
#     from services.resume_structure import structure_resume_text
#     structured = structure_resume_text(answers, role)

#     # 3️⃣ generate PDF
#     pdf_bytes = generate_resume_pdf(structured)

#     return StreamingResponse(
#         BytesIO(pdf_bytes),
#         media_type="application/pdf",
#         headers={"Content-Disposition": "attachment; filename=resume.pdf"}
#     )
@router.post("/pdf")
def download_pdf(data: dict):
    session_id = data.get("session_id")
    role = data.get("role")

    session = get_session(session_id)
    if not session:
        return {"error": "Invalid session_id"}

    answers = session["answers"]

    structured = structure_resume_text(answers, role)

    pdf_bytes = generate_pdf_resume(structured)

    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )


# @router.post("/generate")
# def generate_resume(data: ResumeRequest):
#     enhanced_answers = []

#     for ans in data.answers:
#         improved = enhance_text(ans.answer)
#         enhanced_answers.append({
#             "question": ans.question,
#             "original": ans.answer,
#             "enhanced": improved
#         })
#     return {
#         "role": data.role,
#         "answers": enhanced_answers
#     }
