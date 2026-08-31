"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "¡Hola! Soy el asistente del Método R.E.S.T. 🌙 ¿Tienes dudas sobre el sueño, el programa o cómo funciona? Estoy aquí para orientarte.";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Invitacion automatica: aparece a los 6s para que el usuario entienda que puede preguntar
  useEffect(() => {
    if (teaserDismissed) return;
    const show = setTimeout(() => setTeaser(true), 3000);
    const hide = setTimeout(() => setTeaser(false), 30000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [teaserDismissed]);

  useEffect(() => {
    if (open) {
      setTeaser(false);
      setTeaserDismissed(true);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      const clean = data.reply.replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: clean },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un problema. Intenta de nuevo o escríbenos a metodorest@gmail.com",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] max-h-[500px] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          <div className="bg-[#0A1E1E] border border-rest-accent/10 rounded-2xl flex flex-col h-[460px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rest-accent/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Asistente R.E.S.T.</p>
                  <p className="text-[10px] text-rest-accent">En línea</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-rest-text-muted hover:text-white transition p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "gap-3"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-rest-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-rest-accent/20 rounded-tr-sm text-white"
                        : "bg-white/[0.04] rounded-tl-sm"
                    }`}
                  >
                    <p className={`text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "text-rest-text-secondary"}`}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-rest-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.04]">
                    <div className="flex gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-rest-accent/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-rest-accent/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-rest-accent/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu pregunta..."
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(0,229,160,0.06)] rounded-xl text-sm text-rest-text placeholder:text-rest-text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.3)] transition disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-rest-accent flex items-center justify-center shrink-0 hover:bg-[#00B880] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {teaser && !open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 max-w-[290px] animate-[fadeInUp_0.4s_ease-out]">
          <div className="relative bg-[#0A1E1E] border border-rest-accent/20 rounded-2xl rounded-br-sm px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => {
                setTeaser(false);
                setTeaserDismissed(true);
              }}
              aria-label="Cerrar"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0A1E1E] border border-white/10 flex items-center justify-center text-rest-text-secondary hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button onClick={() => setOpen(true)} className="flex items-start gap-3 text-left">
              <span className="shrink-0 w-9 h-9 rounded-full bg-rest-accent/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </span>
              <span className="block">
                <span className="block text-xs font-semibold text-rest-accent tracking-wide">
                  Asistente R.E.S.T.
                </span>
                <span className="block text-sm text-white leading-snug mt-0.5">
                  ¿Tienes dudas sobre el método o tu sueño?
                </span>
                <span className="block text-xs text-rest-text-secondary mt-1">
                  Pregúntame lo que quieras 🌙
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-[0_4px_20px_rgba(0,229,160,0.3)] hover:shadow-[0_4px_30px_rgba(0,229,160,0.5)] hover:scale-105 ${
          open ? "bg-[#0A1E1E] shadow-[0_4px_20px_rgba(0,0,0,0.4)]" : "bg-rest-accent"
        }`}
      >
        {open ? (
          <svg className="w-6 h-6 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );
}
