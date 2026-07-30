"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  "How can I recycle plastic waste?",
  "What's the market value of metal scrap?",
  "How to reduce CO₂ emissions from waste?",
  "Best practices for hazardous waste handling",
  "How to improve my listing description?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your CircuLink Sustainability Assistant. I can help you with waste management best practices, regulatory guidance, material classification, and tips to optimize your listings. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.data.response,
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="w-6 h-6 text-emerald-600" />
          Sustainability Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-powered guidance on waste management, regulations, and circular economy
        </p>
      </div>

      <Card className="h-[calc(100vh-280px)] flex flex-col">
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-2" : ""}>
                      {line.startsWith("**")
                        ? <strong>{line.replace(/\*\*/g, "")}</strong>
                        : line.startsWith("- ")
                        ? <span>• {line.slice(2)}</span>
                        : line}
                    </p>
                  ))}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="bg-slate-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-2">
            <p className="text-xs text-slate-500 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <Badge
                  key={prompt}
                  variant="outline"
                  className="cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                  onClick={() => sendMessage(prompt)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Ask about waste management, regulations, market insights..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
