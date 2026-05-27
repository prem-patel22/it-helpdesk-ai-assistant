"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your IT Helpdesk Assistant. I can help you with:\n\n• Password resets\n• VPN connection issues\n• Software installation\n• Printer problems\n• WiFi setup\n• Computer performance\n\nWhat can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createTicket = () => {
    window.location.href = `mailto:helpdesk@company.com?subject=IT Ticket: ${encodeURIComponent(
      lastQuestion
    )}&body=User asked: ${encodeURIComponent(lastQuestion)}%0A%0AAI couldn't answer this question.%0A%0APlease assist.%0A%0A---%0AAutomatically generated from IT Helpdesk AI`;
  };

  const escalateToHuman = () => {
    if (
      confirm(
        "Connect with a human IT support agent?\n\nYou will be connected to our IT team. This may take 1–2 minutes."
      )
    ) {
      window.location.href = "tel:+1234567890";
    }
  };

  const getFallbackResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("password") || q.includes("reset")) {
      return "🔐 **To reset your password:**\n\n1. Go to https://password.company-portal.com\n2. Click 'Forgot Password'\n3. Enter your Employee ID\n4. Check your email for the reset link\n5. Create a new password (min 8 characters, 1 uppercase, 1 number)\n\nStill stuck? Contact the IT helpdesk.";
    }
    if (q.includes("vpn")) {
      return "🌐 **VPN Troubleshooting:**\n\n1. Check your internet connection\n2. Restart Cisco AnyConnect\n3. Verify your username and password\n4. Make sure your MFA code is current\n5. If issues persist, contact IT support.";
    }
    if (q.includes("printer")) {
      return "🖨️ **Printer Fix:**\n\n1. Confirm the printer is powered on\n2. Check the paper tray\n3. Restart the Print Spooler:\n   - Press Windows + R → type services.msc\n   - Find 'Print Spooler' → Restart\n4. Clear any stuck print jobs\n5. Restart your computer";
    }
    if (q.includes("wifi") || q.includes("wi-fi")) {
      return "📡 **WiFi Fix:**\n\n1. Click the WiFi icon → toggle Off\n2. Wait 10 seconds → toggle On\n3. Forget the network and reconnect\n4. Run the network troubleshooter\n5. Restart your computer";
    }
    if (
      q.includes("slow") ||
      q.includes("performance") ||
      q.includes("freeze")
    ) {
      return "🐌 **Speed Up Your PC:**\n\n1. Restart your computer (fixes most issues)\n2. Close unused apps (Ctrl + Shift + Esc)\n3. Clear temp files:\n   - Windows + R → type %temp% → delete all\n4. Check for Windows updates\n5. Ensure 10 GB+ of free disk space";
    }
    if (
      q.includes("software") ||
      q.includes("install") ||
      q.includes("teams") ||
      q.includes("office")
    ) {
      return "💻 **Software Installation:**\n\n1. Open the Company Portal app\n2. Search for the software\n3. Click 'Install' and wait for completion\n4. Launch from the Start menu\n\nTo request new software, submit an IT ticket.";
    }
    return "I can help with: passwords, VPN, printers, WiFi, software installation, and computer performance. What specific issue are you facing?";
  };

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const userMessage = (overrideText ?? input).trim();
      if (!userMessage || isLoading) return;

      setLastQuestion(userMessage);
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setIsLoading(true);

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 25000)
      );

      try {
        const fetchPromise = fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages,
              { role: "user", content: userMessage },
            ],
          }),
        });

        const response = (await Promise.race([
          fetchPromise,
          timeoutPromise,
        ])) as Response;

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        let aiResponse: string = data.reply;

        if (!aiResponse || aiResponse.includes("error") || aiResponse.length < 10) {
          aiResponse = getFallbackResponse(userMessage);
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiResponse },
        ]);
      } catch {
        const fallback = getFallbackResponse(userMessage);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fallback },
        ]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestionQuestions = [
    "How do I reset my password?",
    "VPN won't connect",
    "Install Microsoft Office",
    "Printer not printing",
    "WiFi not connecting",
    "Computer is slow",
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950">
      {/* Subtle background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header with Ticket/IT buttons moved here */}
      <header className="relative z-10 px-6 py-4 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xl"
            aria-hidden
          >
            🤖
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white leading-tight">
              IT Helpdesk AI Assistant
            </h1>
            <p className="text-xs text-slate-400">
              24/7 Support · Instant Answers · Enterprise Grade
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Support Buttons - Always visible */}
            <button
              onClick={createTicket}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-medium transition-colors"
              title="Create IT Ticket"
            >
              📧 Create Ticket
            </button>
            <button
              onClick={escalateToHuman}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg text-teal-300 text-xs font-medium transition-colors"
              title="Talk to IT"
            >
              🗣️ Talk to IT
            </button>
            {/* Online status */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" aria-hidden />
              <span className="text-xs text-teal-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-sm mr-2 mt-1 shrink-0"
                  aria-hidden
                >
                  🤖
                </div>
              )}
              <div
                className={`max-w-[80%] md:max-w-[68%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-teal-600 text-white rounded-br-sm"
                    : "bg-slate-800 border border-slate-700/60 text-slate-100 rounded-bl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-sm shrink-0"
                aria-hidden
              >
                🤖
              </div>
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 rounded-full bg-teal-400"
                      style={{ animation: `bounce 1.2s ${delay}ms infinite` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick suggestions — shown only at the start */}
      {messages.length <= 2 && (
        <div className="relative z-10 px-4 py-3 border-t border-slate-700/50 bg-slate-900/60">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-slate-400 mb-2">⚡ Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600/50 rounded-full text-xs text-slate-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Support Buttons (visible on small screens) */}
      <div className="relative z-10 px-4 py-2 border-t border-slate-700/50 bg-slate-900/80 sm:hidden">
        <div className="max-w-4xl mx-auto flex gap-2 justify-center">
          <button
            onClick={createTicket}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-medium transition-colors"
          >
            📧 Create Ticket
          </button>
          <button
            onClick={escalateToHuman}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg text-teal-300 text-xs font-medium transition-colors"
          >
            🗣️ Talk to IT
          </button>
        </div>
      </div>

      {/* Input */}
      <footer className="relative z-10 px-4 py-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything… e.g. 'How do I reset my password?'"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-600/50 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 disabled:opacity-50 transition"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              Send
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Powered by Claude AI · Secure &amp; Private
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}