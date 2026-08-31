"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    id: "day",
    question: "¿Cómo fue tu día en una palabra?",
    type: "select" as const,
    options: ["Tranquilo", "Productivo", "Agotador", "Estresante", "Neutro", "Gratificante"],
  },
  {
    id: "gratitude",
    question: "¿Qué agradeces hoy?",
    type: "text" as const,
    placeholder: "Algo pequeño o grande que te hizo bien hoy...",
  },
  {
    id: "release",
    question: "¿Qué puedes soltar antes de dormir?",
    type: "text" as const,
    placeholder: "Una preocupación, pensamiento o tensión que no necesitas llevar a la cama...",
  },
];

export default function RitualPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const q = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  const setAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const next = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      setCompleted(true);
    }
  };

  const canAdvance = !!answers[q?.id];

  if (completed) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-rest-accent/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Ritual completado</h1>
        <p className="text-rest-text-secondary text-sm mb-8 max-w-sm">
          Has cerrado el día con intención. Tu mente ya sabe que es hora de descansar.
        </p>

        {/* Summary */}
        <div className="w-full p-5 rounded-2xl glass-card text-left mb-8">
          <h3 className="font-medium text-sm text-rest-text-muted mb-4">Tu cierre de hoy</h3>
          <div className="space-y-4">
            {questions.map((question, i) => (
              <div key={i}>
                <p className="text-rest-text-muted text-xs mb-1">{question.question}</p>
                <p className="text-white text-sm">{answers[question.id]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/app"
            className="px-5 py-2.5 bg-rest-accent/10 text-rest-accent rounded-xl text-sm font-medium hover:bg-rest-accent/20 transition"
          >
            Volver al inicio
          </Link>
          <Link
            href="/app/respiraciones"
            className="px-5 py-2.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg rounded-xl text-sm font-medium transition shadow-[0_0_12px_rgba(0,229,160,0.3)]"
          >
            Respiración para dormir
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Header */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-rest-accent text-xs uppercase tracking-widest">Ritual de cierre</p>
          <p className="text-rest-text-muted text-xs">{currentQ + 1} de {questions.length}</p>
        </div>
        <div className="w-full h-1.5 bg-rest-accent/10 rounded-full overflow-hidden">
          <div className="h-full bg-rest-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="w-full text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-rest-accent/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-rest-accent font-bold text-lg">{currentQ + 1}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{q.question}</h2>
        <p className="text-rest-text-muted text-xs">Tómate un momento para reflexionar</p>
      </div>

      {/* Answer */}
      <div className="w-full mb-8">
        {q.type === "select" && q.options && (
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={`p-3 rounded-xl text-sm text-left transition-all ${
                  answers[q.id] === opt
                    ? "bg-rest-accent text-rest-bg font-semibold shadow-[0_0_16px_rgba(0,229,160,0.3)] scale-[1.03]"
                    : "bg-[#0a1e1e] shadow-[0_2px_6px_rgba(0,0,0,0.3)] text-rest-text-secondary hover:bg-rest-accent/[0.06]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === "text" && (
          <textarea
            value={answers[q.id] || ""}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={3}
            className="w-full p-4 rounded-xl bg-[#0a1e1e] text-rest-text text-sm placeholder:text-rest-text-muted/50 focus:outline-none focus:ring-1 focus:ring-rest-accent/20 transition resize-none shadow-[inset_0_0_0_1px_rgba(0,229,160,0.06)] focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.25)]"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {currentQ > 0 && (
          <button
            onClick={() => setCurrentQ((p) => p - 1)}
            className="px-4 py-2.5 text-rest-text-muted text-sm hover:text-rest-text transition"
          >
            ← Anterior
          </button>
        )}
        <button
          onClick={next}
          disabled={!canAdvance}
          className="px-6 py-2.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg text-sm font-semibold rounded-xl transition-all shadow-[0_0_12px_rgba(0,229,160,0.3)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {currentQ < questions.length - 1 ? "Siguiente" : "Completar ritual"}
        </button>
      </div>
    </div>
  );
}
