import os
import sys
from resume_extractor import extract_resume_text
from grammar_enhancement import enhance_resume
from resume_limitations import check_sections
def process_resume(file_path):
    """Processes the resume and provides structured results without printing raw text."""

    # Step 1: Validate file existence
    if not os.path.isfile(file_path):
        print(f"\n❌ Error: File '{file_path}' not found. Please provide a valid file.")
        return

    # Step 2: Extract text without printing raw content
    print("\n🔍 Extracting text from resume...")
    resume_text = extract_resume_text(file_path)

    if not resume_text or "Unsupported file format" in resume_text:
        print("❌ Error: Unsupported or empty file. Please provide a valid PDF or DOCX file.")
        return

    # Step 3: Check for resume limitations
    print("\n🔍 Checking resume limitations...")
    limitations = check_sections(resume_text)

    # Step 4: Enhance grammar and spelling
    print("\n🔍 Enhancing grammar and fixing spelling mistakes...")
    improved_text, grammar_issues, weak_sentences = enhance_resume(resume_text)

    # Step 5: Display structured results
    print("\n📊 **Resume Analysis Report**")

    # Resume Limitations
    if limitations:
        print("\n⚠️ **Limitations Found:**")
        for issue in limitations:
            print(f" - {issue}")
    else:
        print("✅ No major limitations detected!")

    # Grammar Issues (Only display summaries, not full raw text)
    if grammar_issues:
        print("\n📝 **Grammar Fixes:**")
        for issue in grammar_issues[:5]:  
            print(f" - ❌ Incorrect: {issue[0]} → ✅ Suggested: {issue[1]}")
        if len(grammar_issues) > 5:
            print("  ...and more.")
    else:
        print("✅ No major grammar issues found!")

    # Weak Sentences (Summarized)
    if weak_sentences:
        print("\n🔹 **Weak Sentences Improved:**")
        for weak in weak_sentences[:5]:  
            print(f" - {weak}")
        if len(weak_sentences) > 5:
            print("  ...and more.")
    else:
        print("✅ No weak sentences found!")

    # Step 6: Save the enhanced resume
    output_pdf = file_path.replace(".pdf", "_improved.pdf").replace(".docx", "_improved.docx")
    try:
        with open(output_pdf, "w", encoding="utf-8") as f:
            f.write(improved_text)
        print(f"\n✅ **Enhanced Resume Saved As:** {output_pdf}")
    except Exception as e:
        print(f"\n❌ Error: Could not save enhanced resume. {e}")

# Example usage
if __name__ == "__main__":
    if len(sys.argv) > 1:
        resume_file = sys.argv[1]
    else:
        resume_file = "sample_resume.pdf"  # Default file if not provided

    process_resume(resume_file)