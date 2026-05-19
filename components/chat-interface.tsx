"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm your IT Helpdesk Assistant. I can help you with:\n\n• Password resets\n• VPN connection issues\n• Software installation\n• Printer problems\n• WiFi setup\n• Computer performance\n\nWhat can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTicketButton, setShowTicketButton] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createTicket = () => {
    window.location.href = `mailto:helpdesk@company.com?subject=IT Ticket: ${encodeURIComponent(lastQuestion)}&body=User asked: ${encodeURIComponent(lastQuestion)}%0A%0AAI couldn't answer this question.%0A%0APlease assist.%0A%0A---%0AAutomatically generated from IT Helpdesk AI`;
  };

  const escalateToHuman = () => {
    if (confirm("Connect with a human IT support agent?\n\nYou will be connected to our IT team. This may take 1-2 minutes.")) {
      window.location.href = "tel:+1234567890";
    }
  };

  // Retry last message function
  const retryLastMessage = async () => {
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      // Small delay to ensure state updates
      setTimeout(() => sendMessage(), 100);
    }
  };

  // Fallback responses when API fails
  const getFallbackResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes("password") || q.includes("reset")) {
      return "🔐 **To reset your password:**\n\n1. Go to https://password.company-portal.com\n2. Click 'Forgot Password'\n3. Enter your Employee ID\n4. Check your email for reset link\n5. Create a new password (min 8 characters, 1 uppercase, 1 number)\n\nNeed more help? Contact IT helpdesk.";
    }
    
    if (q.includes("vpn")) {
      return "🌐 **VPN Troubleshooting:**\n\n1. Check your internet connection\n2. Restart Cisco AnyConnect\n3. Verify your username and password\n4. Check MFA code is correct\n5. If still issues, contact IT support.";
    }
    
    if (q.includes("printer")) {
      return "🖨️ **Printer Fix:**\n\n1. Make sure printer is turned ON\n2. Check paper tray has paper\n3. Restart Print Spooler:\n   - Press Windows + R\n   - Type: services.msc\n   - Find 'Print Spooler' → Restart\n4. Clear any stuck print jobs\n5. Restart your computer";
    }
    
    if (q.includes("wifi") || q.includes("wi-fi")) {
      return "📡 **WiFi Fix:**\n\n1. Click WiFi icon → Toggle OFF\n2. Wait 10 seconds → Toggle ON\n3. Forget network and reconnect\n4. Run network troubleshooter\n5. Restart your computer";
    }
    
    if (q.includes("slow") || q.includes("performance") || q.includes("freeze")) {
      return "🐌 **Speed up your PC:**\n\n1. Restart your computer (fixes most issues!)\n2. Close unused programs (Ctrl+Shift+Esc)\n3. Clear temp files:\n   - Press Windows + R\n   - Type: %temp%\n   - Delete all files\n4. Check for Windows updates\n5. Ensure enough disk space (10GB+ free)";
    }
    
    if (q.includes("software") || q.includes("install") || q.includes("teams") || q.includes("office")) {
      return "💻 **Software Installation:**\n\n1. Open Company Portal app\n2. Search for the software\n3. Click 'Install'\n4. Wait for completion\n5. Launch from Start menu\n\nTo request new software, submit a ticket to IT.";
    }
    
    return "I can help with: passwords, VPN, printers, WiFi, software installation, and computer performance. What specific issue are you facing?";
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setLastQuestion(userMessage);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setShowTicketButton(false);

    // Add timeout for the entire request (25 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 25000);
    });

    try {
      const fetchPromise = fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.reply;
      
      // If response is error message or too short, use fallback
      if (!aiResponse || aiResponse.includes("error") || aiResponse.length < 10) {
        aiResponse = getFallbackResponse(userMessage);
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);

      if (
        aiResponse.toLowerCase().includes("don't know") ||
        aiResponse.toLowerCase().includes("doesn't have that information") ||
        aiResponse.toLowerCase().includes("contact it helpdesk") ||
        aiResponse.toLowerCase().includes("i don't have")
      ) {
        setShowTicketButton(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Use fallback response instead of generic error
      const fallbackResponse = getFallbackResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackResponse },
      ]);
      setShowTicketButton(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🤖</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                IT Helpdesk AI Assistant
              </h1>
              <p className="text-blue-100 mt-1 text-sm md:text-base">
                24/7 Support | Instant Answers | Enterprise Grade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, idx) => (
            <div key={idx}>
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
              {/* Retry button for error messages */}
              {message.role === "assistant" && message.content.includes("Service is busy") && (
                <div className="flex justify-start mt-1 ml-4">
                  <button
                    onClick={retryLastMessage}
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    🔄 Retry
                  </button>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          
          {/* Ticket Creation Button */}
          {showTicketButton && (
            <div className="flex justify-center animate-fade-in">
              <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 max-w-md">
                <p className="text-yellow-200 text-sm text-center mb-3">
                  🤔 I couldn't answer this question. Would you like to create a ticket?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={createTicket}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    📧 Create IT Ticket
                  </button>
                  <button
                    onClick={escalateToHuman}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    🗣️ Talk to IT
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="relative z-10 px-4 py-3 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-blue-200 mb-3 flex items-center gap-2">
              <span className="text-lg">⚡</span> Quick Questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestionQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="group relative px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span className="relative z-10">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative z-10 p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... e.g., 'How do I reset my password?'"
              className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span className="flex items-center gap-2">
                Send
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Powered by Google Gemini AI | Secure & Private
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }
        .delay-100 { animation-delay: -0.32s; }
        .delay-200 { animation-delay: -0.16s; }
      `}</style>
    </div>
  );
}