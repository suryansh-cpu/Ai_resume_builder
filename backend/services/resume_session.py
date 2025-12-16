# # services/resume_session.py

# # In-memory session storage (later can be replaced with DB)
# SESSIONS = {}

# def start_session():
#     """Create a new resume-building session."""
#     session_id = len(SESSIONS) + 1
#     SESSIONS[session_id] = {
#         "answers": [],
#         "current_index": 0
#     }
#     return session_id

# def save_answer(session_id: int, answer: str):
#     """Save the user's answer and move to the next question."""
#     if session_id not in SESSIONS:
#         return False

#     SESSIONS[session_id]["answers"].append(answer)
#     SESSIONS[session_id]["current_index"] += 1
#     return True

# def get_session(session_id: int):
#     """Return session data."""
#     return SESSIONS.get(session_id, None)

# services/resume_session.py

# A simple in-memory session store
SESSIONS = {}
SESSION_COUNTER = 1


def start_session():
    global SESSION_COUNTER

    session_id = SESSION_COUNTER
    SESSION_COUNTER += 1

    SESSIONS[session_id] = {
        "current_index": 0,
        "answers": []
    }

    return session_id


def get_session(session_id):
    return SESSIONS.get(session_id)


def save_answer(session_id, text):
    session = SESSIONS.get(session_id)
    if not session:
        return False

    session["answers"].append(text)
    session["current_index"] += 1
    return True
