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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, I encountered an error. Please try again.",
        },
      ]);
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

  // Don't render until mounted to avoid hydration mismatch
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
            <div
              key={idx}
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions - Only show when few messages */}
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

      {/* Add animation styles */}
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
      `}</style>
    </div>
  );
}