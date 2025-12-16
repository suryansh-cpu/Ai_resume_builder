from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

from backend.services.llm_client import run_llm

router = APIRouter(prefix="/chat", tags=["Chatbot"])


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


@router.post("")
def chat(req: ChatRequest):
    """
    Simple chatbot endpoint.
    Frontend sends full conversation history.
    Backend returns next assistant reply.
    """

    system_prompt = (
        "You are a professional resume assistant chatbot. "
        "You ask relevant questions, clarify details, and help "
        "the user describe their experience clearly."
    )

    # Convert chat history into a single prompt
    conversation = ""
    for msg in req.messages:
        conversation += f"{msg.role.upper()}: {msg.content}\n"

    reply = run_llm(system_prompt, conversation)

    return {
        "reply": reply
    }
