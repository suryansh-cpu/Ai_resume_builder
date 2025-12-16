# import fitz  # PyMuPDF for PDF processing
# import language_tool_python
# from spellchecker import SpellChecker
# import nltk
# from nltk.corpus import names
# import geonamescache  # For filtering city and country names
# import re
# import multiprocessing

# # Ensure NLTK dataset is downloaded
# nltk.download("names")

# tool = language_tool_python.LanguageTool("en-US")
# # Define words to ignore (programming-related terms, websites, etc.)
# ignore_words = {
#     "LeetCode", "HackerRank", "CodeChef", "Codeforces", "Atcoder",
#     "GitHub", "LinkedIn", "TechFest", "CPU", "AI", "ML", "API"
# }

# def extract_resume_text(pdf_path):
#     """Extracts text from a PDF file."""
#     try:
#         doc = fitz.open(pdf_path)
#         text = "\n".join([page.get_text("text") for page in doc])
#         doc.close()
#         return text.strip()
#     except Exception as e:
#         print(f"❌ Error extracting text: {e}")
#         return ""

# def extract_name_from_resume(pdf_path):
#     """Extracts the candidate's name from the first non-empty line of the resume."""
#     text = extract_resume_text(pdf_path)
#     first_line = text.split("\n")[0].strip()
#     return first_line if first_line else "Unknown"

# def check_grammar(sentence):
#     """Checks grammar for a single sentence."""
#     tool = language_tool_python.LanguageTool("en-US")
#     matches = tool.check(sentence)
#     for match in matches:
#         suggestion = match.replacements[0] if match.replacements else None
#         if suggestion:
#             return sentence.replace(match.context, suggestion)
#     return sentence  # Return unchanged if no correction

# def check_spelling(word, spell):
#     """Checks spelling for a single word."""
#     if word.lower() in ignore_words:
#         return None  # Ignore known terms
#     correction = spell.correction(word)
#     return (word, correction) if correction and correction != word else None

# def enhance_resume(resume_text):
#     """Enhances the resume by fixing grammar and spelling mistakes (FAST VERSION)."""

#     # Initialize tools
#     tool = language_tool_python.LanguageTool("en-US")
#     spell = SpellChecker()

#     # Load proper names and locations to ignore
#     all_names = set(names.words())
#     gc = geonamescache.GeonamesCache()
#     cities = {city["name"] for city in gc.get_cities().values()}
#     countries = {country["name"] for country in gc.get_countries().values()}

#     # Step 1: **Grammar Checking (Parallel)**
#     sentences = resume_text.split(". ")
#     with multiprocessing.Pool(processes=4) as pool:  # Use 4 CPU cores for faster processing
#         enhanced_sentences = pool.map(check_grammar, sentences)

#     enhanced_text = ". ".join(enhanced_sentences)

#     # Step 2: **Optimized Spell-Checking (Parallel)**
#     words = re.findall(r'\b\w+\b', resume_text)
#     with multiprocessing.Pool(processes=4) as pool:
#         spelling_issues = pool.starmap(check_spelling, [(word, spell) for word in words])

#     # Remove None values (ignored words)
#     spelling_issues = [issue for issue in spelling_issues if issue is not None]

#     # Step 3: **Weak Sentences Detection**
#     weak_sentences = [sentence.strip() for sentence in sentences if len(sentence.split()) < 5 and len(sentence) > 0]

#     return enhanced_text, spelling_issues[:5], weak_sentences[:5]  # Show top 5 spelling and weak sentences

# def enhance_text(text: str) -> str:
#     """
#     Fully enhance a sentence:
#     - fixes grammar
#     - fixes spelling
#     - returns the full corrected sentence
#     """
#     matches = tool.check(text)

#     corrected = text
#     for match in reversed(matches):
#         if match.replacements:
#             corrected = (
#                 corrected[:match.offset] +
#                 match.replacements[0] +
#                 corrected[match.offset + match.errorLength:]
#             )

#     # Capitalize + ensure final period
#     corrected = corrected.strip()
#     if corrected and not corrected.endswith("."):
#         corrected += "."

#     return corrected

# if __name__ == "__main__":
#     pdf_path = "sample_resume.pdf"  # Change this to your actual file
#     resume_text = extract_resume_text(pdf_path)
    
#     if not resume_text:
#         print("❌ Error: Could not extract text from resume.")
#     else:
#         print("\n🔍 Enhancing resume...")
#         enhanced_text, spelling_fixes, weak_sentences = enhance_resume(resume_text)

#         print("\n📊 **Resume Enhancement Summary**")

#         # Spelling Fixes
#         if spelling_fixes:
#             print("\n🔤 **Spelling Corrections:**")
#             for word, correction in spelling_fixes:  
#                 print(f" - ❌ {word} → ✅ {correction}")
#         else:
#             print("✅ No major spelling mistakes found!")

#         # Weak Sentences
#         if weak_sentences:
#             print("\n🔹 **Weak Sentences Identified:**")
#             for weak in weak_sentences:  
#                 print(f" - {weak}")
#         else:
#             print("✅ No weak sentences found!")



# import requests
# import json
# import os
# from typing import Optional

# # Env for speed (set in terminal: export OLLAMA_KEEP_ALIVE=30m; export OLLAMA_NUM_GPU_LAYERS=20)
# MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2:3b')  # Fast default

# # Preload on import (warms model—run once at startup)
# def _preload_model():
#     try:
#         requests.post("http://localhost:11434/api/generate", json={"model": MODEL, "prompt": "Warm up resume expert.", "stream": False})
#         print(f"✅ Ollama {MODEL} preloaded.")
#     except Exception as e:
#         print(f"⚠️ Preload fail: {e} (Start 'ollama serve'?)")

# _preload_model()  # Fires on import

# def run_ollama(prompt: str, stream: bool = False) -> str:
#     """Core API call—streaming optional for live UI feel."""
#     try:
#         payload = {
#             "model": MODEL,
#             "prompt": prompt,
#             "stream": stream,
#             "options": {"num_predict": 200, "temperature": 0.7}  # Cap/speed tweaks
#         }
#         response = requests.post("http://localhost:11434/api/generate", json=payload)
#         response.raise_for_status()
#         if stream:
#             # Chunk for frontend (return list of deltas)
#             chunks = []
#             for line in response.iter_lines():
#                 if line:
#                     chunk = json.loads(line)
#                     if 'response' in chunk:
#                         chunks.append(chunk['response'])
#                     if chunk.get('done'):
#                         break
#             return ''.join(chunks)
#         else:
#             data = response.json()
#             return data.get("response", "").strip()
#     except Exception as e:
#         print("🔥 Ollama API Error:", e)
#         return "AI temp down—check ollama serve. Fallback: Original text."

# def enhance_text(text: str, job_title: Optional[str] = None) -> str:
#     """Enhance a section—your original prompt + job context."""
#     job = f" for {job_title}" if job_title else ""
#     prompt = f"""
#     You are a resume writing expert.

#     Rewrite the following text to be:
#     - Grammatically correct
#     - Professional
#     - Clear and concise
#     - Strong resume language with quantifiable achievements where possible
#     - Keep all meaning SAME
#     - Do NOT add extra information
#     - Do NOT remove personal info
#     - Do NOT output anything except the rewritten improved text

#     TEXT TO REWRITE (tailored for Software Engineer role{job}):
#     {text}
#     """
#     output = run_ollama(prompt)
#     return output.strip()

# def chat_resume(prompt: str, resume_context: Optional[str] = None, job_title: str = "Software Engineer") -> str:
#     """Chat mode—for iterative builder."""
#     context = f"Current resume: {resume_context[:300]}..." if resume_context else "No resume loaded."
#     full_prompt = f"""
#     You are a helpful resume builder AI. {context}
#     Job target: {job_title}.
#     User: {prompt}

#     Respond professionally: Generate or suggest resume content only (e.g., section, bullets). Keep concise, ATS-friendly. No chit-chat.
#     """
#     output = run_ollama(full_prompt)
#     return output.strip()

from backend.services.llm_client import run_llm


def enhance_text(text: str, job_title: str = "Software Engineer") -> str:
    system_prompt = (
        "You are an expert resume writer and ATS optimization specialist. "
        "You rewrite text to sound professional, concise, and impactful "
        "without changing the original meaning."
    )

    PROMPT = f"""
        Improve the following text professionally.
        Do NOT add new facts.
        Keep it concise.

        Text:
        {content}
    """


    return run_llm(system_prompt, user_prompt)
