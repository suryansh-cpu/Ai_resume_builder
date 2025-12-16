# import pdfplumber
# import docx
# from io import BytesIO

# def extract_text_from_pdf(pdf_bytes: bytes) -> str:
#     """Extract text from a PDF uploaded as bytes."""
#     try:
#         text = ""
#         with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#         return text.strip()
#     except Exception as e:
#         return f"PDF extraction error: {str(e)}"


# def extract_text_from_docx(doc_bytes: bytes) -> str:
#     """Extract text from a DOCX file uploaded as bytes."""
#     try:
#         text = ""
#         doc = docx.Document(BytesIO(doc_bytes))
#         for para in doc.paragraphs:
#             text += para.text + "\n"
#         return text.strip()
#     except Exception as e:
#         return f"DOCX extraction error: {str(e)}"


# def extract_resume_text(file_bytes: bytes, filename: str) -> str:
#     """Auto-detect file type and extract resume text."""
#     if filename.endswith(".pdf"):
#         return extract_text_from_pdf(file_bytes)
#     elif filename.endswith(".docx"):
#         return extract_text_from_docx(file_bytes)
#     else:
#         return "Unsupported file format"

import pdfplumber
import docx

def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("PDF read error:", e)
        return None

    return text.strip()
