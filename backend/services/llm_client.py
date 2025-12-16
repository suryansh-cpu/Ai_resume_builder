import ollama

# MODEL_NAME = "llama3:3b"
MODEL_NAME = "llama3.2:3b"


# 🔥 load once
_client = ollama.Client()

def generate_with_llm(prompt: str) -> str:
    response = _client.chat(
        model=MODEL_NAME,
        messages=[
            {"role": "user", "content": prompt}
        ],
        options={
            "num_predict": 400,   # 🔥 hard cap tokens (key change)
            "temperature": 0.4,   # stable, less rambling
            "top_p": 0.9
        }
    )
    return response["message"]["content"]
run_llm = generate_with_llm

# import requests
# import json

# OLLAMA_URL = "http://localhost:11434/api/generate"
# MODEL_NAME = "llama3:3b"  # change ONLY if you know the model exists


# def run_llm(prompt: str) -> str:
#     """
#     Single-source LLM call using Ollama.
#     Returns plain text. Never crashes the app.
#     """

#     payload = {
#         "model": MODEL_NAME,
#         "prompt": prompt,
#         "stream": False,
#     }

#     try:
#         response = requests.post(OLLAMA_URL, json=payload, timeout=120)
#         response.raise_for_status()

#         data = response.json()
#         return data.get("response", "").strip()

#     except Exception as e:
#         print("❌ OLLAMA FAILED:", str(e))

#         # HARD FALLBACK (so UI never breaks)
#         return """
#         Professional Summary:
#         Backend-focused software engineer with experience in APIs and AI systems.

#         Skills:
#         Python, FastAPI, React, SQL, Docker

#         Experience:
#         Developed resume generation and ATS optimization services.

#         Projects:
#         AI Resume Builder – Resume generation
#     """
