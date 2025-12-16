from weasyprint import HTML
from jinja2 import Template
import os

TEMPLATE_PATH = os.path.join("templates", "resume_template.html")

def generate_pdf_from_html(data: dict):
    # Load template
    with open(TEMPLATE_PATH, "r") as f:
        template_str = f.read()

    # Fill template
    template = Template(template_str)
    html_content = template.render(
        summary=data.get("Summary", ""),
        experience=data.get("Experience", ""),
        projects=data.get("Projects", ""),
        skills=data.get("Skills", ""),
        role=data.get("Role", "")
    )

    # Convert to PDF bytes
    pdf = HTML(string=html_content).write_pdf()

    return pdf
