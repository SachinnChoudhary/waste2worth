"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Send, Search, User, Building2, Clock, Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";

function MessagesContent() {
  const searchParams = useSearchParams();
  const recipientCompanyId = searchParams.get("recipient");

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      const data = await res.json();
      if (data.success) {
        setConversations(data.data || []);
        if (data.data.length > 0 && !activeConvId) {
          setActiveConvId(data.data[0].id);
        }
      }
    } catch {
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConvs(false);
    }
  };

  // If redirected with recipient query param, start or open conversation
  useEffect(() => {
    if (recipientCompanyId) {
      initConversationWithCompany(recipientCompanyId);
    }
  }, [recipientCompanyId]);

  const initConversationWithCompany = async (companyId: string) => {
    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientCompanyId: companyId }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveConvId(data.data.id);
        fetchConversations();
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  const fetchMessages = async (convId: string) => {
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
      }
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConvId) return;

    setSending(true);
    const content = input;
    setInput("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConvId, content }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        fetchConversations();
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-600" /> Direct Messages & Negotiations
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Communicate directly with buyer and seller partner representatives
        </p>
      </div>

      <Card className="h-[calc(100vh-220px)] overflow-hidden border border-slate-200 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full divide-x divide-slate-200">
          {/* Left Column: Conversations List */}
          <div className="flex flex-col h-full bg-slate-50">
            <div className="p-3 border-b bg-white">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search messages..." className="pl-9 h-9 text-xs" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversations.length > 0 ? (
                conversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                        isActive ? "bg-emerald-50/80 border-l-4 border-emerald-600" : "hover:bg-slate-100/70"
                      }`}
                    >
                      <Avatar className="w-10 h-10 border border-slate-200 flex-shrink-0">
                        <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-xs">
                          {conv.otherUser?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {conv.otherUser?.companyName || conv.otherUser?.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(conv.updatedAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {conv.otherUser?.name}
                        </p>
                        {conv.lastMessage && (
                          <p className="text-xs text-slate-600 truncate mt-1 italic">
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : !loadingConvs ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No active conversations.</p>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Box */}
          <div className="md:col-span-2 flex flex-col h-full bg-white">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="h-16 px-6 border-b flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-emerald-600 text-white font-bold text-xs">
                        {activeConv.otherUser?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {activeConv.otherUser?.companyName || activeConv.otherUser?.name}
                      </h3>
                      <p className="text-xs text-slate-500">Representative: {activeConv.otherUser?.name}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                    Active Channel
                  </Badge>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => {
                    const isOther = msg.senderId === activeConv.otherUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isOther ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            isOther
                              ? "bg-slate-100 text-slate-900 rounded-tl-none"
                              : "bg-emerald-600 text-white rounded-tr-none"
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <span
                            className={`block text-[10px] mt-1 text-right ${
                              isOther ? "text-slate-400" : "text-emerald-200"
                            }`}
                          >
                            {formatRelativeTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2 bg-slate-50/30">
                  <Input
                    placeholder="Type your message, logistics query, or offer terms..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={sending}
                    className="flex-1 bg-white"
                  />
                  <Button type="submit" disabled={sending || !input.trim()} className="bg-emerald-600 text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                <h3 className="text-base font-semibold text-slate-700">Select a conversation</h3>
                <p className="text-xs text-slate-400 mt-1">Choose a partner thread from the left or contact a seller directly from marketplace listings.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
