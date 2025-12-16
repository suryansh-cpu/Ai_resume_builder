# # from fastapi import FastAPI, UploadFile, File
# # import pdfplumber
# # import language_tool_python
# # import re

# # app = FastAPI()

# # def extract_text_from_pdf(pdf_file):
# #     """Extracts text from a PDF resume."""
# #     text = ""
# #     try:
# #         with pdfplumber.open(pdf_file) as pdf:
# #             for page in pdf.pages:
# #                 page_text = page.extract_text()
# #                 if page_text:
# #                     text += page_text + "\n"
# #     except Exception as e:
# #         return None

# #     return text.strip() if text else None

# # def check_grammar(text):
# #     """Checks grammar mistakes in the resume and returns a Mistake Score."""
# #     tool = language_tool_python.LanguageTool("en-US")
# #     tool.disable_spellchecking()  # Ignore spellchecking

# #     matches = tool.check(text)
    
# #     num_errors = len(matches)
# #     mistake_score = max(30, 100 - num_errors * 2)  # Scaled mistake score

# #     return {"mistake_score": mistake_score, "error_count": num_errors}

# # def calculate_resume_score(text):
# #     """Evaluates the resume based on ATS-friendly criteria and assigns a Resume Score."""
    
# #     sections = {
# #         "Education": re.search(r"\b(Education|Academic Background)\b", text, re.IGNORECASE),
# #         "Work Experience": re.search(r"\b(Work Experience|Professional Experience|Employment History)\b", text, re.IGNORECASE),
# #         "Skills": re.search(r"\b(Skills|Technical Skills|Core Competencies)\b", text, re.IGNORECASE),
# #         "Contact Info": re.search(r"\b(Email|Phone|LinkedIn)\b", text, re.IGNORECASE),
# #     }
# #     section_score = sum(1 for s in sections.values() if s) / len(sections) * 40  

# #     keywords = ["Python", "Machine Learning", "Data Analysis", "SQL", "AWS", "Leadership"]
# #     keyword_count = sum(text.lower().count(k.lower()) for k in keywords)
# #     keyword_score = min(30, keyword_count * 2)  

# #     bullet_points = len(re.findall(r"•|-", text))  
# #     bullet_score = 15 if bullet_points > 5 else 5  

# #     word_count = len(text.split())
# #     length_score = 15 if 300 <= word_count <= 800 else 5  

# #     resume_score = round(section_score + keyword_score + bullet_score + length_score)
    
# #     return {"resume_score": resume_score, "section_score": section_score, "keyword_score": keyword_score, "bullet_score": bullet_score, "length_score": length_score}

# # @app.post("/upload/")
# # async def upload_pdf(file: UploadFile = File(...)):
# #     """API endpoint to process a resume PDF and return ATS score."""
    
# #     pdf_text = extract_text_from_pdf(file.file)
    
# #     if not pdf_text:
# #         return {"error": "Could not extract text from the PDF."}

# #     grammar_result = check_grammar(pdf_text)
# #     resume_result = calculate_resume_score(pdf_text)

# #     return {
# #         "grammar": grammar_result,
# #         "resume": resume_result
# #     }



# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import pdfplumber
# import language_tool_python
# import re
# import io
# from pydantic import BaseModel
# from routes.resume import router as resume_router
# from routes.ats import router as ats_router
# app = FastAPI()
# app.include_router(resume_router)
# app.include_router(ats_router)
# class QAItem(BaseModel):
#     question: str
#     answer: str

# class ResumeInput(BaseModel):
#     role: str
#     answers: list[QAItem]

# @app.get("/")
# def home():
#     return {"status": "Backend running"}
# @app.post("/generate_resume")
# async def generate_resume(data: ResumeInput):
#     enhanced_list = []

#     for item in data.answers:
#         enhanced = enhance_text(item.answer)

#         enhanced_list.append({
#             "question": item.question,
#             "original": item.answer,
#             "enhanced": enhanced
#         })

#     return {
#         "role": data.role,
#         "answers": enhanced_list
#     }


# # Add CORS middleware to allow requests from your frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Your frontend URL (adjust as needed)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def extract_text_from_pdf(pdf_file):
#     """Extracts text from a PDF resume."""
#     text = ""
#     try:
#         with pdfplumber.open(pdf_file) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#     except Exception as e:
#         return None
    
#     return text.strip() if text else None

# def check_grammar(text):
#     """Checks grammar mistakes in the resume and returns a Mistake Score."""
#     tool = language_tool_python.LanguageTool("en-US")
#     tool.disable_spellchecking()  # Ignore spellchecking
    
#     matches = tool.check(text)
    
#     num_errors = len(matches)
#     mistake_score = max(30, 100 - num_errors * 2)  # Scaled mistake score
    
#     return {"mistake_score": mistake_score, "error_count": num_errors}

# def calculate_resume_score(text):
#     """Evaluates the resume based on ATS-friendly criteria and assigns a Resume Score."""
    
#     sections = {
#         "Education": re.search(r"\b(Education|Academic Background)\b", text, re.IGNORECASE),
#         "Work Experience": re.search(r"\b(Work Experience|Professional Experience|Employment History)\b", text, re.IGNORECASE),
#         "Skills": re.search(r"\b(Skills|Technical Skills|Core Competencies)\b", text, re.IGNORECASE),
#         "Contact Info": re.search(r"\b(Email|Phone|LinkedIn)\b", text, re.IGNORECASE),
#     }
#     section_score = sum(1 for s in sections.values() if s) / len(sections) * 40
    
#     keywords = ["Python", "Machine Learning", "Data Analysis", "SQL", "AWS", "Leadership"]
#     keyword_count = sum(text.lower().count(k.lower()) for k in keywords)
#     keyword_score = min(30, keyword_count * 2)
    
#     bullet_points = len(re.findall(r"•|-", text))
#     bullet_score = 15 if bullet_points > 5 else 5
    
#     word_count = len(text.split())
#     length_score = 15 if 300 <= word_count <= 800 else 5
    
#     resume_score = round(section_score + keyword_score + bullet_score + length_score)
    
#     return {
#         "resume_score": resume_score, 
#         "section_score": section_score, 
#         "keyword_score": keyword_score, 
#         "bullet_score": bullet_score, 
#         "length_score": length_score
#     }

# @app.post("/upload/")
# async def upload_pdf(file: UploadFile = File(...)):
#     """API endpoint to process a resume PDF and return ATS score."""
    
#     # Read the file content
#     contents = await file.read()
#     pdf_text = extract_text_from_pdf(io.BytesIO(contents))
    
#     if not pdf_text:
#         return {"error": "Could not extract text from the PDF."}
    
#     grammar_result = check_grammar(pdf_text)
#     resume_result = calculate_resume_score(pdf_text)
    
#     return {
#         "grammar": grammar_result,
#         "resume": resume_result
#     }

from fastapi import FastAPI
from backend.routes.resume import router as resume_router
from backend.routes.ats import router as ats_router
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.chat import router as chat_router
from backend.routes.resume_from_chat import router as resume_from_chat_router
from backend.services.llm_client import run_llm

app = FastAPI()
@app.on_event("startup")
def warm_up_llm():
    try:
        import ollama

        ollama.chat(
            model="llama3:8b",
            messages=[
                {"role": "system", "content": "Warm up"}
            ]
        )

        print("✅ LLM warm-up successful")

    except Exception as e:
        print(f"⚠️ LLM warm-up skipped: {e}")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(resume_router)
app.include_router(ats_router)
app.include_router(chat_router)
app.include_router(resume_from_chat_router)

@app.get("/")
def home():
    return {"status": "Backend running"}
