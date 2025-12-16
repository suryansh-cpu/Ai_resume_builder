# from fastapi import APIRouter
# from pydantic import BaseModel
# from typing import List

# from backend.services.llm_client import run_llm
# from backend.services.enhance import enhance_text
# from backend.services.resume_structure import structure_resume_text

# router = APIRouter(prefix="/resume", tags=["Resume from Chat"])


# class ChatMessage(BaseModel):
#     role: str
#     content: str


# class ResumeFromChatRequest(BaseModel):
#     messages: List[ChatMessage]
#     role: str = "Software Engineer"


# @router.post("/from-chat")
# def generate_resume_from_chat(req: ResumeFromChatRequest):
#     """
#     Converts a full chat conversation into a structured resume.
#     """

#     # 1️⃣ Extract raw resume sections from chat
#     system_prompt = (
#         "You are an expert resume extractor. "
#         "From the conversation, extract content for these sections:\n"
#         "- Professional Summary\n"
#         "- Work Experience\n"
#         "- Projects\n"
#         "- Skills\n\n"
#         "Return them clearly separated."
#     )

#     conversation = ""
#     for msg in req.messages:
#         conversation += f"{msg.role.upper()}: {msg.content}\n"

#     extracted = run_llm(system_prompt, conversation)

#     # 2️⃣ Convert extracted text into Q&A style
#     answers = [
#         {
#             "question": "Give a short professional summary",
#             "answer": extracted
#         }
#     ]

#     # 3️⃣ Enhance language
#     structured_resume = structure_resume_text(answers)


#     # # 4️⃣ Structure resume
#     # structured_resume = structure_resume_text(answers, req.role)

#     return {
#     "resume": {
#         "name": "",
#         "title": "",
#         "summary": structured_resume.get("Summary", ""),
#         "skills": structured_resume.get("Skills", ""),
#         "experience": structured_resume.get("Experience", ""),
#         "projects": structured_resume.get("Projects", ""),
#         "education": structured_resume.get("Education", ""),
#         "certifications": structured_resume.get("Certifications", ""),
#         "contact": structured_resume.get("Contact", "")
#     }
# }


from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.llm_client import run_llm
from backend.services.resume_structure import structure_resume_text

router = APIRouter(prefix="/resume", tags=["Resume"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ResumeFromChatRequest(BaseModel):
    role: str
    messages: list[ChatMessage]

@router.post("/from-chat")
def generate_resume_from_chat(req: ResumeFromChatRequest):
    system_prompt = (
        "You are an expert resume extractor.\n"
        "From the conversation, extract content for these sections:\n"
        "- Professional Summary\n"
        "- Work Experience\n"
        "- Projects\n"
        "- Skills\n\n"
        "Return them clearly separated."
    )

    conversation = ""
    for m in req.messages:
        conversation += f"{m.role.upper()}: {m.content}\n"

    raw_text = run_llm(system_prompt + "\n\n" + conversation)

    structured_resume = structure_resume_text(
        raw_text,
        role=req.role
    )

    return {
        "resume": structured_resume
    }
