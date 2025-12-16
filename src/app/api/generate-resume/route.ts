import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Your FastAPI backend URL (Python)
    const pythonServer = "http://127.0.0.1:8000/generate_resume";

    // Send data to Python backend
    const pythonResponse = await fetch(pythonServer, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await pythonResponse.json();
    return NextResponse.json({ success: true, resume: result });
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
