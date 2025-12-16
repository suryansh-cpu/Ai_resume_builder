import streamlit as st
import ollama
import pdfplumber  # For PDF parsing
from io import BytesIO

# Config
MODEL = 'llama3:8b'  # Your 3-5GB model
OLLAMA_URL = 'http://localhost:11434'

st.title("🔥 AI Resume Builder & Enhancer")

# Sidebar for uploads
with st.sidebar:
    uploaded_file = st.file_uploader("Upload Resume (PDF/TXT)", type=['pdf', 'txt'])
    job_title = st.text_input("Target Job Title", "Software Engineer")
    MODEL = st.selectbox("Model (Speed vs. Depth)", ['llama3.2:3b', 'llama3:8b', 'llama3.1:8b'], index=0)
    ats_keywords = st.text_area("ATS Keywords (comma-separated)", "Python, AWS, Agile")  # For scoring

if uploaded_file:
    if uploaded_file.type == 'application/pdf':
        with pdfplumber.open(BytesIO(uploaded_file.read())) as pdf:
            resume_text = '\n'.join(page.extract_text() for page in pdf.pages)
    else:
        resume_text = uploaded_file.read().decode('utf-8')
    
    st.session_state['resume'] = resume_text
    st.success("Resume loaded!")
else:
    resume_text = st.session_state.get('resume', '')
    st.info("Upload a resume to start.")

# Tab 1: Chatbot Builder
tab1, tab2, tab3 = st.tabs(["💬 Chatbot Builder", "✨ Enhancer", "📊 ATS Checker"])

with tab1:
    st.header("Build Your Resume via Chat")
    if 'messages' not in st.session_state:
        st.session_state.messages = [{"role": "assistant", "content": "Hi! Tell me about your experience, or ask to generate a section (e.g., 'Write summary for software dev')."}]
    
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
    
    if prompt := st.chat_input("Your message"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Ollama call for response
        full_prompt = f"User resume so far: {resume_text}\nUser: {prompt}\nHelp build/enhance resume for {job_title}. Keep professional, concise."
        try:
            resp = ollama.chat(model=MODEL, messages=[{"role": "user", "content": full_prompt}])
            ai_msg = resp['message']['content']
        except Exception as e:
            ai_msg = f"Oops: {e}. Check Ollama is running?"
        
        st.session_state.messages.append({"role": "assistant", "content": ai_msg})
        with st.chat_message("assistant"):
            st.markdown(ai_msg)

with tab2:
    st.header("Enhance Resume Section")
    section = st.text_area("Paste Section to Enhance", height=150, placeholder="e.g., Experience bullets")
    if st.button("Enhance!"):
        if section:
            prompt = f"Enhance this resume section for {job_title}: {section}\nSuggest 3 improved bullets with quantifiable achievements."
            try:
                resp = ollama.generate(model=MODEL, prompt=prompt)
                st.markdown("**Enhanced Version:**")
                st.write(resp['response'])
            except Exception as e:
                st.error(f"Error: {e}")
        else:
            st.warning("Add a section first.")

with tab3:
    st.header("ATS Score (Jugaad + AI)")
    keywords = [kw.strip() for kw in ats_keywords.split(',') if kw.strip()]
    
    # Simple keyword match (your jugaad base)
    matches = sum(1 for kw in keywords if kw.lower() in resume_text.lower())
    keyword_score = (matches / len(keywords)) * 50 if keywords else 0
    
    # AI semantic boost
    if resume_text:
        ai_prompt = f"Score this resume {resume_text} for {job_title} on ATS fit (0-50): Focus on semantics beyond keywords {keywords}."
        try:
            resp = ollama.generate(model=MODEL, prompt=ai_prompt)
            ai_score = float(resp['response'].split()[-1]) if resp['response'] else 0  # Parse last number
        except:
            ai_score = 0
        total_score = min(100, keyword_score + ai_score)
    else:
        total_score = 0
    
    st.metric("ATS Score", f"{total_score:.0f}/100", delta=None)
    st.write(f"Keyword Matches: {matches}/{len(keywords)}")
    if total_score < 70:
        st.warning("Boost with more keywords/achievements!")
    # Plug your exact jugaad here if different

# Download enhanced resume (basic export)
if st.session_state.get('resume'):
    enhanced = st.text_area("Final Resume Text", resume_text, height=300)
    st.download_button("Download TXT", enhanced, file_name="enhanced_resume.txt")
# Download enhanced resume (basic export)
if 'resume' in st.session_state:
    # Use chat-generated or original as base
    enhanced = st.text_area("Final Resume Text (Edit & Download)", 
                            st.session_state.get('enhanced_resume', st.session_state['resume']), 
                            height=300, key='enhanced_text')
    
    col1, col2 = st.columns(2)
    with col1:
        st.download_button("Download TXT", enhanced, file_name="enhanced_resume.txt")
    with col2:
        if st.button("Download as PDF"):
            try:
                from reportlab.lib.pagesizes import letter
                from reportlab.pdfgen import canvas
                from reportlab.lib.styles import getSampleStyleSheet
                from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
                
                # Temp file path
                pdf_file = "enhanced_resume.pdf"
                doc = SimpleDocTemplate(pdf_file, pagesize=letter)
                story = []
                styles = getSampleStyleSheet()
                
                # Split enhanced into lines for better layout
                lines = enhanced.split('\n')
                for line in lines:
                    if line.strip():
                        # Bold for headers (heuristic: lines starting with uppercase or numbers)
                        if line[0].isupper() or line[0].isdigit():
                            p = Paragraph(f"<b>{line.strip()}</b>", styles['Heading2'])
                        else:
                            p = Paragraph(line.strip(), styles['Normal'])
                        story.append(p)
                    story.append(Spacer(1, 12))  # Line spacing
                
                doc.build(story)
                with open(pdf_file, "rb") as f:
                    st.download_button("PDF Ready!", f.read(), file_name="enhanced_resume.pdf")
                # Cleanup (optional)
                import os
                os.remove(pdf_file)
            except Exception as e:
                st.error(f"PDF Gen Oops: {e}. TXT works as fallback!")
else:
    st.info("Chat or enhance first to populate the text.")