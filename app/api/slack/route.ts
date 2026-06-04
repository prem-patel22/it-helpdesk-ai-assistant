import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Slack URL verification
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }
    
    // Get the user's question
    const userQuestion = body.text || body.event?.text || "";
    
    if (!userQuestion) {
      return NextResponse.json({
        text: "🙋 Please ask me a question!\n\nExample: `/ithelp How do I reset my password?`"
      });
    }
    
    // Get response using same logic as chat
    const reply = getSlackResponse(userQuestion);
    
    return NextResponse.json({
      text: reply,
      response_type: "in_channel"
    });
    
  } catch (error) {
    console.error("Slack error:", error);
    return NextResponse.json(
      { text: "❌ Something went wrong. Please try again." },
      { status: 200 }
    );
  }
}

function getSlackResponse(question: string): string {
  const q = question.toLowerCase();
  
  // Password Reset
  if (q.includes("password") || q.includes("reset") || q.includes("forgot")) {
    return "🔐 *Password Reset Steps:*\n\n1. Go to https://password.company-portal.com\n2. Click 'Forgot Password'\n3. Enter your Employee ID\n4. Check email for reset link\n5. Create new password (8+ chars, 1 uppercase, 1 number)\n\nNeed help? Contact IT: patelpremalpeshkumar@gmail.com";
  }
  
  // VPN Issues
  if (q.includes("vpn") || q.includes("cisco")) {
    return "🌐 *VPN Troubleshooting:*\n\n1. Check your internet connection\n2. Restart Cisco AnyConnect\n3. Verify your username/password\n4. Check MFA code\n5. Restart your computer\n\nStill issues? Contact IT support.";
  }
  
  // Printer Problems
  if (q.includes("printer") || q.includes("print")) {
    return "🖨️ *Printer Troubleshooting:*\n\n1. Check printer is ON\n2. Add paper if needed\n3. Restart Print Spooler:\n   - Press Windows + R\n   - Type: services.msc\n   - Find 'Print Spooler' → Restart\n4. Restart computer\n\nContact IT if still not working.";
  }
  
  // WiFi Issues
  if (q.includes("wifi") || q.includes("wi-fi")) {
    return "📡 *WiFi Troubleshooting:*\n\n1. Toggle WiFi OFF → Wait 10 sec → ON\n2. Reconnect to network\n3. Forget and reconnect\n4. Restart computer\n\nStill issues? Contact IT support.";
  }
  
  // Slow Computer
  if (q.includes("slow") || q.includes("performance")) {
    return "🐌 *Speed up your computer:*\n\n1. Restart your computer\n2. Close unused programs (Ctrl+Shift+Esc)\n3. Clear temp files (Windows+R → %temp%)\n4. Check for Windows updates\n\nStill slow? Contact IT support.";
  }
  
  // Software Installation
  if (q.includes("software") || q.includes("install") || q.includes("office") || q.includes("teams")) {
    return "💻 *Software Installation:*\n\n1. Open Company Portal\n2. Search for the app\n3. Click 'Install'\n4. Wait for completion\n5. Launch from Start menu\n\nNeed new software? Submit request to IT.";
  }
  
  // Default response
  return "🤖 *IT Helpdesk Assistant*\n\nAsk me about:\n• Password reset\n• VPN issues\n• Printer problems\n• WiFi issues\n• Slow computer\n• Software installation\n\nExample: `/ithelp How do I reset my password?`";
}