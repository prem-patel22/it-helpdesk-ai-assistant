import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Get the last user message
    const lastMessage = messages.filter((m: any) => m.role === "user").pop();
    const userQuestion = lastMessage?.content || "";
    
    // Get API key from environment
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { reply: "⚠️ API key not configured. Please add GOOGLE_GEMINI_API_KEY to .env.local file." },
        { status: 200 }
      );
    }
    
    // ✅ THIS MODEL WORKS (tested and confirmed)
    const modelName = "gemini-3.1-flash-lite-preview";
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an IT Helpdesk Assistant. Answer this employee's question.

Rules:
- Give step-by-step instructions
- Be helpful and professional
- If unsure, say: "Contact IT helpdesk at helpdesk@company.com"

Question: ${userQuestion}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      return NextResponse.json(
        { reply: `❌ API Error: ${response.status}. Please try again.` },
        { status: 200 }
      );
    }
    
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "❌ An error occurred. Please try again." },
      { status: 200 }
    );
  }
}