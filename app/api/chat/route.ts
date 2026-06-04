import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    const lastMessage = messages.filter((m: any) => m.role === "user").pop();
    const userQuestion = lastMessage?.content || "";
    
    // Get relevant content based on question
    const reply = getContentByQuestion(userQuestion);
    
    return NextResponse.json({ reply });
    
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "Please try again." },
      { status: 200 }
    );
  }
}

function getContentByQuestion(question: string): string {
  const q = question.toLowerCase();
  
  // Determine which file to read based on question
  let fileToRead = "";
  
  if (q.includes("password") || q.includes("reset") || q.includes("forgot")) {
    fileToRead = "password-reset.md";
  } else if (q.includes("vpn") || q.includes("cisco") || q.includes("anyconnect")) {
    fileToRead = "vpn-setup.md";
  } else if (q.includes("printer") || q.includes("print")) {
    fileToRead = "printer-troubleshooting.md";
  } else if (q.includes("wifi") || q.includes("wi-fi") || q.includes("wireless")) {
    fileToRead = "wifi-troubleshooting.md";
  } else if (q.includes("software") || q.includes("install") || q.includes("office") || q.includes("teams")) {
    fileToRead = "software-installation.md";
  } else if (q.includes("slow") || q.includes("performance") || q.includes("freeze") || q.includes("lag")) {
    fileToRead = "computer-performance.md";
  } else {
    // Return menu of available topics
    return getMenu();
  }
  
  // Read the specific file
  const content = readMarkdownFile(fileToRead);
  
  if (content) {
    return formatResponse(content, getEmojiForTopic(q));
  }
  
  return getFallbackResponse(question);
}

function readMarkdownFile(filename: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "content", filename);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return content;
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

function getEmojiForTopic(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("password")) return "🔐";
  if (q.includes("vpn")) return "🌐";
  if (q.includes("printer")) return "🖨️";
  if (q.includes("wifi")) return "📡";
  if (q.includes("software") || q.includes("install")) return "💻";
  if (q.includes("slow") || q.includes("performance")) return "🐌";
  return "📚";
}

function formatResponse(content: string, emoji: string): string {
  // Clean up the content - remove the filename header if present
  let cleanContent = content;
  
  // Remove any "--- filename.md ---" lines
  cleanContent = cleanContent.replace(/^---\s*[\w-]+\.md\s*---\s*$/gm, '');
  
  // Trim extra whitespace
  cleanContent = cleanContent.trim();
  
  return `${emoji} **${cleanContent}\n\n---\n\nNeed more help? Contact IT: patelpremalpeshkumar@gmail.com`;
}

function getMenu(): string {
  return `🤖 **IT Helpdesk Assistant**

I can help you with these topics:

🔐 **Password Reset** - Ask: "How do I reset my password?"
🌐 **VPN Connection** - Ask: "VPN not working"
🖨️ **Printer Issues** - Ask: "Printer not printing"
📡 **WiFi Setup** - Ask: "WiFi not connecting"
💻 **Software Installation** - Ask: "Install Microsoft Office"
🐌 **Computer Performance** - Ask: "Computer is slow"

**Just type your question above!**`;
}

function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes("password") || q.includes("reset")) {
    return "🔐 **How to reset your password:**\n\n1. Go to https://password.company-portal.com\n2. Click 'Forgot Password'\n3. Enter your Employee ID\n4. Check your email for reset link\n5. Create new password\n\n**Password must have:**\n• 8+ characters\n• 1 uppercase letter\n• 1 number\n• 1 special character";
  }
  
  if (q.includes("vpn")) {
    return "🌐 **VPN Troubleshooting:**\n\n1. Check your internet connection\n2. Restart Cisco AnyConnect\n3. Verify your username/password\n4. Check MFA code\n5. Restart computer";
  }
  
  if (q.includes("printer")) {
    return "🖨️ **Printer Troubleshooting:**\n\n1. Check printer is ON\n2. Add paper if needed\n3. Restart Print Spooler\n4. Clear stuck print jobs\n5. Restart computer";
  }
  
  if (q.includes("wifi")) {
    return "📡 **WiFi Troubleshooting:**\n\n1. Toggle WiFi OFF/ON\n2. Reconnect to network\n3. Forget and reconnect\n4. Restart computer";
  }
  
  return getMenu();
}