from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO

def generate_pdf_resume(structured):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>Resume</b>", styles["Title"]))
    story.append(Spacer(1, 12))

    for key, value in structured.items():
        story.append(Paragraph(f"<b>{key.capitalize()}</b>", styles["Heading2"]))
        story.append(Paragraph(value.replace("\n", "<br/>"), styles["BodyText"]))
        story.append(Spacer(1, 12))

    doc.build(story)

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


# from reportlab.lib.pagesizes import letter
# from reportlab.pdfgen import canvas
# from io import BytesIO

# def generate_resume_pdf(text: str) -> bytes:
#     """
#     Takes final resume text and returns binary PDF bytes.
#     """

#     buffer = BytesIO()
#     pdf = canvas.Canvas(buffer, pagesize=letter)

#     pdf.setFont("Helvetica", 11)

#     x = 40
#     y = 750
#     line_height = 15

#     for line in text.split("\n"):
#         if y < 40:  # new page
#             pdf.showPage()
#             pdf.setFont("Helvetica", 11)
#             y = 750

#         pdf.drawString(x, y, line)
#         y -= line_height

#     pdf.save()
#     buffer.seek(0)

#     return buffer.getvalue()
