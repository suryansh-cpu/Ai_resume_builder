# def structure_resume_text(answers, role):
#     """
#     Convert chatbot answers into a structured resume object.
#     """

#     mapping = {
#         "Give a short professional summary": "Summary",
#         "Describe your past job experience": "Experience",
#         "List your projects": "Projects",
#         "List your technical skills": "Skills"
#     }

#     structured = {
#         "Summary": "",
#         "Experience": "",
#         "Projects": "",
#         "Skills": "",
#         "Role": role
#     }

#     for item in answers:
#         q = item["question"]
#         a = item["answer"]

#         # map the question → resume section
#         for key, section in mapping.items():
#             if key.lower() in q.lower():
#                 structured[section] = a

#     return structured

def structure_resume_text(text: str, role: str = "Professional") -> dict:
    """
    Takes raw extracted text and converts it into sections
    expected by ResumePreview.
    """

    sections = {
        "Summary": "",
        "Skills": "",
        "Experience": "",
        "Projects": "",
        "Role": role,
    }

    current = None

    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue

        if "summary" in line.lower():
            current = "Summary"
            continue
        if "skill" in line.lower():
            current = "Skills"
            continue
        if "experience" in line.lower():
            current = "Experience"
            continue
        if "project" in line.lower():
            current = "Projects"
            continue

        if current:
            sections[current] += line + "\n"

    # fallback if model didn't label properly
    if not any(sections[k].strip() for k in ["Summary", "Skills", "Experience", "Projects"]):
        sections["Summary"] = text

    return sections
