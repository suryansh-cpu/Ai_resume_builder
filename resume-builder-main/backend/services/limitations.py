import re
from PyPDF2 import PdfReader

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    return text

# Function to check presence of key sections
def check_sections(text):
    issues = []

    # Define required sections
    required_sections = {
        "LinkedIn": r"linkedin\.com|",  # Check for 'linkedin.com' or LinkedIn symbol
        "Phone Number": r"[^+]\b\d{10}\b",  # 10-digit number, excluding +91
        "Email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",  # Email regex
        "Education": r"education",
        "10th Marks": r"10th|secondary school|high school",
        "12th Marks": r"12th|higher secondary",
        "Certifications": r"certifications?",
        "Work Experience": r"work experience|employment history",
        "Skills": r"skills",
        "Soft Skills": r"soft skills"
    }

    for section, pattern in required_sections.items():
        if not re.search(pattern, text, re.IGNORECASE):
            issues.append(f"⚠️ {section} section is missing or unclear.")

    # Check if skills section is weak
    skills_match = re.search(r"skills[:\n]([\s\S]+?)(?:\n\n|$)", text, re.IGNORECASE)
    if skills_match:
        skills_content = skills_match.group(1)
        skills_count = len(re.findall(r"\b\w+\b", skills_content))  # Count words
        if skills_count < 2:
            issues.append("⚠️ Skills section is weak. Consider adding more relevant skills.")

    # Check project section for at least 2 clear projects
    projects = re.findall(r"(?:(?:project|internship)[:\n])([\s\S]+?)(?:\n\n|$)", text, re.IGNORECASE)
    project_count = len([proj for proj in projects if len(proj.split()) > 10])  # Check if projects have enough words
    if project_count < 2:
        issues.append("⚠️ Less than 2 distinct projects found. Consider differentiating them better.")

    return issues

# Run script
pdf_path = "sample_resume.pdf"  # Change this if needed
resume_text = extract_text_from_pdf(pdf_path)

limitations = check_sections(resume_text)

# Print results
if limitations:
    print("\nResume Limitations:")
    for issue in limitations:
        print(issue)
else:
    print("✅ No major limitations found!")