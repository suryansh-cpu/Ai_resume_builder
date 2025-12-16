# # services/role_detect_and_score.py
# import requests
# import re
# from typing import Dict, Any
# import math
# import logging

# OLLAMA_URL = "http://localhost:11434/api/generate"
# OLLAMA_MODEL = "llama3.1:8b"  # adjust if needed
# OLLAMA_TIMEOUT = 8  # seconds

# logger = logging.getLogger(__name__)

# # Role labels we accept
# ROLE_LABELS = {
#     "sde-1": "SDE-1 (DSA / Backend focused)",
#     "backend": "Backend Engineer",
#     "frontend": "Frontend Engineer",
#     "ml-engineer": "ML Engineer / Data Scientist",
#     "devops": "DevOps / SRE",
#     "product-manager": "Product Manager",
#     "ux-designer": "UX / UI Designer",
#     "data-engineer": "Data Engineer",
#     "other": "Other"
# }

# # Role-specific keywords (expand as you go)
# ROLE_KEYWORDS = {
#     "sde-1": [
#         "data structure", "data structures", "algorithms", "leetcode", "codeforces",
#         "competitive programming", "DSA", "problem solving", "c++", "java", "python",
#         "stack", "queue", "graph", "tree", "recursion", "dynamic programming",
#         "time complexity", "O(n)", "implementation", "contest"
#     ],
#     "backend": [
#         "rest", "api", "backend", "server", "node", "express", "flask", "django",
#         "spring", "database", "sql", "mysql", "postgres", "mongodb", "transaction",
#         "microservice", "grpc"
#     ],
#     "frontend": [
#         "react", "javascript", "typescript", "css", "html", "redux", "next.js", "ui",
#         "ux", "frontend", "web", "tailwind", "sass", "styled-components"
#     ],
#     "ml-engineer": [
#         "machine learning", "deep learning", "tensorflow", "pytorch", "sklearn",
#         "model", "neural network", "nlp", "computer vision", "data science",
#         "feature engineering"
#     ],
#     "devops": [
#         "docker", "kubernetes", "terraform", "aws", "gcp", "ci/cd", "jenkins", "ansible",
#         "monitoring", "prometheus", "grafana"
#     ],
#     "product-manager": ["roadmap", "stakeholder", "product", "metrics", "okrs", "user research"],
#     "ux-designer": ["wireframe", "figma", "prototype", "usability", "user research", "accessibility"],
#     "data-engineer": ["etl", "airflow", "spark", "hadoop", "data pipeline", "bigquery"],
#     "other": []
# }

# # Strict detection prompt. **Important: model MUST return exactly one role key** (lowercase).
# DETECTION_PROMPT_TEMPLATE = """You are a classification assistant. Given a resume text, identify the most appropriate job ROLE from this predefined list:
# roles = ["sde-1","backend","frontend","ml-engineer","devops","product-manager","ux-designer","data-engineer","other"]

# Return **only one** role token (exactly as shown above). DO NOT return any explanation, punctuation, or extra text.

# Resume text:
# \"\"\"
# {text}
# \"\"\"

# Which role from the list best matches the resume?
# Return only the single role token.
# """

# def call_ollama(prompt: str, model: str = OLLAMA_MODEL, timeout: int = OLLAMA_TIMEOUT) -> str:
#     try:
#         resp = requests.post(
#             OLLAMA_URL,
#             json={
#                 "model": model,
#                 "prompt": prompt,
#                 "max_tokens": 64,
#                 "stream": False
#             },
#             timeout=timeout,
#         )
#         resp.raise_for_status()
#         data = resp.json()
#         # Ollama returns something like {"response":"..."}
#         return data.get("response", "").strip()
#     except Exception as e:
#         logger.exception("Ollama call failed")
#         return ""

# def detect_role_from_text(resume_text: str) -> str:
#     """Try to detect role using Ollama; fallback to heuristic if needed."""
#     # Guard - keep input short-ish for detection (first 1500 chars)
#     sample = resume_text[:3500]

#     prompt = DETECTION_PROMPT_TEMPLATE.format(text=sample)
#     resp = call_ollama(prompt)

#     # Clean response: only lowercase letters, hyphen
#     token = ""
#     if resp:
#         token = resp.splitlines()[0].strip().lower()
#         token = re.sub(r"[^a-z0-9\-]", "", token)

#     # If token valid, return it
#     if token in ROLE_LABELS:
#         return token

#     # fallback: simple heuristic by keyword counts
#     counts = {}
#     lower = resume_text.lower()
#     for role, kws in ROLE_KEYWORDS.items():
#         counts[role] = sum(lower.count(k.lower()) for k in kws)
#     # choose max (if zero, return "other")
#     best_role = max(counts, key=lambda r: counts[r])
#     if counts[best_role] == 0:
#         return "other"
#     return best_role

# def score_resume_for_role(resume_text: str, role: str) -> Dict[str, Any]:
#     """
#     Compute an adaptive score based on role-specific keywords and sections.
#     Returns: {score:int, issues: {...} }
#     """
#     txt = resume_text or ""
#     lower = txt.lower()

#     # Sections check (simple)
#     sections_found = []
#     for sec_name, patterns in {
#         "Education": ["education", "academic", "degree", "bachelor", "master","CPI"],
#         "Experience": ["experience", "work experience", "professional experience", "employment"],
#         "Skills": ["skills", "technical skills", "competencies", "Soft Skills"],
#         "Contact": ["email", "@", "phone", "linkedin"],
#         "Projects": ["projects", "personal projects", "side projects"],
#         "Hobbies": ["hobbies", "interests", "extra-curricular activities", "awards"],
#         "Achievements": ["achievements", "awards", "honors", "recognitions"],
#     }.items():
#         for p in patterns:
#             if p in lower:
#                 sections_found.append(sec_name)
#                 break

#     missing_sections = [s for s in ["Education","Experience","Skills","Contact","Projects","Hobbies", "Achievements"] if s not in sections_found]

#     # keyword counting tuned by role
#     kws = ROLE_KEYWORDS.get(role, [])
#     keyword_found_count = sum(1 for k in kws if k in lower)

#     # bullet & word counts
#     bullet_count = len(re.findall(r"(?:•|-|\\u2022|\\- )", txt))
#     word_count = max(1, len(re.findall(r"\w+", txt)))

#     # grammar issues placeholder (you already have grammar checker — integrate if you want)
#     # For now, keep grammar issues = 0 so it does not unfairly penalize
#     grammar_issues = 0

#     # Scoring rules:
#     #  - base: 40
#     #  - sections: up to 20 (5 each)
#     #  - keywords: up to 30 (scale)
#     #  - length/bullets: up to 10
#     base = 40
#     sections_score = (len(sections_found) / 4.0) * 20  # 0..20
#     # keywords target depends on role (SDE-1 needs fewer keywords than ML)
#     target_keywords = {
#         "sde-1": 4,
#         "backend": 4,
#         "frontend": 5,
#         "ml-engineer": 7,
#         "devops": 5,
#         "data-engineer": 5,
#         "product-manager": 3,
#         "ux-designer": 3,
#         "other": 3
#     }.get(role, 4)

#     keyword_score = min(30, (keyword_found_count / max(1, target_keywords)) * 30)
#     length_score = 10 if 200 <= word_count <= 1200 else max(0, 10 - int(abs(500 - word_count) / 200))

#     raw_score = base + sections_score + keyword_score + length_score - missing_sections.__len__() * 10
#     # penalize heavy grammar issues if you integrate later: e.g. raw_score -= grammar_issues * 0.3

#     final_score = int(max(0, min(100, math.floor(raw_score))))

#     issues = {
#         "missing_sections": missing_sections,
#         "grammar_issues": grammar_issues,
#         "keyword_count": keyword_found_count,
#         "bullet_count": bullet_count,
#         "word_count": word_count,
#     }
#     return {"score": final_score, "issues": issues, "detected_role": ROLE_LABELS.get(role, role)}



import re
import math
import logging
from typing import Dict, Any

from backend.services.llm_client import run_llm

logger = logging.getLogger(__name__)

# Role labels we accept
ROLE_LABELS = {
    "sde-1": "SDE-1 (DSA / Backend focused)",
    "backend": "Backend Engineer",
    "frontend": "Frontend Engineer",
    "ml-engineer": "ML Engineer / Data Scientist",
    "devops": "DevOps / SRE",
    "product-manager": "Product Manager",
    "ux-designer": "UX / UI Designer",
    "data-engineer": "Data Engineer",
    "other": "Other"
}

# Role-specific keywords (heuristic fallback)
ROLE_KEYWORDS = {
    "sde-1": [
        "data structure", "algorithms", "leetcode", "codeforces", "dsa",
        "problem solving", "c++", "java", "python", "graph", "tree",
        "dynamic programming", "time complexity"
    ],
    "backend": [
        "rest", "api", "backend", "server", "flask", "django",
        "database", "sql", "postgres", "mongodb", "microservice"
    ],
    "frontend": [
        "react", "javascript", "typescript", "css", "html",
        "redux", "next.js", "tailwind"
    ],
    "ml-engineer": [
        "machine learning", "deep learning", "tensorflow", "pytorch",
        "neural network", "nlp", "computer vision"
    ],
    "devops": [
        "docker", "kubernetes", "aws", "ci/cd",
        "terraform", "monitoring"
    ],
    "product-manager": ["roadmap", "stakeholder", "metrics", "okrs"],
    "ux-designer": ["figma", "wireframe", "prototype", "usability"],
    "data-engineer": ["etl", "airflow", "spark", "data pipeline"],
    "other": []
}

DETECTION_SYSTEM_PROMPT = (
    "You are a resume role classifier. "
    "You must return ONLY one role token from the allowed list. "
    "No explanations."
)

DETECTION_USER_PROMPT = """
Allowed roles:
["sde-1","backend","frontend","ml-engineer","devops","product-manager","ux-designer","data-engineer","other"]

Resume text:
\"\"\"
{text}
\"\"\"

Return ONLY the role token.
"""


def detect_role_from_text(resume_text: str) -> str:
    """
    Detect role using LLM first.
    Fallback to keyword heuristic if LLM output is invalid.
    """
    sample = (resume_text or "")[:3500]

    try:
        response = run_llm(
            DETECTION_SYSTEM_PROMPT,
            DETECTION_USER_PROMPT.format(text=sample),
        )
    except Exception:
        logger.exception("LLM role detection failed")
        response = ""

    token = re.sub(r"[^a-z0-9\-]", "", response.strip().lower())

    if token in ROLE_LABELS:
        return token

    # Fallback heuristic
    lower = resume_text.lower()
    scores = {
        role: sum(lower.count(k) for k in kws)
        for role, kws in ROLE_KEYWORDS.items()
    }

    best_role = max(scores, key=scores.get)
    return best_role if scores[best_role] > 0 else "other"


def score_resume_for_role(resume_text: str, role: str) -> Dict[str, Any]:
    txt = resume_text or ""
    lower = txt.lower()

    sections_found = []
    section_patterns = {
        "Education": ["education", "degree", "bachelor", "master", "cpi"],
        "Experience": ["experience", "employment"],
        "Skills": ["skills", "technical skills"],
        "Contact": ["email", "@", "phone", "linkedin"],
        "Projects": ["projects"],
        "Hobbies": ["hobbies", "interests"],
        "Achievements": ["achievements", "awards", "honors"],
    }

    for section, patterns in section_patterns.items():
        if any(p in lower for p in patterns):
            sections_found.append(section)

    missing_sections = [
        s for s in section_patterns.keys() if s not in sections_found
    ]

    kws = ROLE_KEYWORDS.get(role, [])
    keyword_found_count = sum(1 for k in kws if k in lower)

    bullet_count = len(re.findall(r"(?:•|-|\u2022)", txt))
    word_count = max(1, len(re.findall(r"\w+", txt)))

    base = 40
    sections_score = (len(sections_found) / 4.0) * 20

    target_keywords = {
        "sde-1": 4,
        "backend": 4,
        "frontend": 5,
        "ml-engineer": 7,
        "devops": 5,
        "data-engineer": 5,
        "product-manager": 3,
        "ux-designer": 3,
        "other": 3,
    }.get(role, 4)

    keyword_score = min(30, (keyword_found_count / target_keywords) * 30)
    length_score = 10 if 200 <= word_count <= 1200 else max(
        0, 10 - abs(500 - word_count) // 200
    )
    # Penalize irrelevant role keywords
    irrelevant_penalty = 0
    for other_role, kws in ROLE_KEYWORDS.items():
        if other_role != role:
            irrelevant_penalty += sum(1 for k in kws if k in lower)

    irrelevant_penalty = min(10, irrelevant_penalty)

    raw_score = (
        base
        + sections_score
        + keyword_score
        + length_score
        - len(missing_sections) * 10
        - irrelevant_penalty
    )

    final_score = int(max(0, min(100, math.floor(raw_score))))

    return {
        "score": final_score,
        "issues": {
            "missing_sections": missing_sections,
            "keyword_count": keyword_found_count,
            "bullet_count": bullet_count,
            "word_count": word_count,
        },
        "detected_role": ROLE_LABELS.get(role, role),
    }
