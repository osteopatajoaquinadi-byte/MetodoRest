"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const ebookConfig = {
  title: "Método R.E.S.T.",
  subtitle: "Duerme mejor, vive mejor",
  author: "Joaquín Adi",
  authorRole: "Osteópata Clínico",
  coverImage: "/ebooks/metodo-rest-cover.jpg",
  pdfFile: "/ebooks/metodo-rest.pdf",
  pages: 67,
};

function useContentProtection() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-protected]")) e.preventDefault();
    };
    const onCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-protected]")) {
        e.preventDefault();
        e.clipboardData?.setData("text/plain", `Contenido protegido — ${ebookConfig.title} © ${ebookConfig.author}`);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && ["s", "p", "u"].includes(e.key.toLowerCase())) e.preventDefault();
      if (ctrl && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === "F12") e.preventDefault();
      if (e.key === "PrintScreen") {
        e.preventDefault();
        blurAll();
        setTimeout(unblurAll, 1500);
      }
    };
    const onDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-protected]")) e.preventDefault();
    };

    const blurAll = () => {
      document.querySelectorAll("[data-protected]").forEach(el => el.classList.add("content-hidden"));
    };
    const unblurAll = () => {
      document.querySelectorAll("[data-protected]").forEach(el => el.classList.remove("content-hidden"));
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        blurAll();
      } else {
        setTimeout(unblurAll, 800);
      }
    };

    const onWindowBlur = () => blurAll();
    const onWindowFocus = () => setTimeout(unblurAll, 800);

    // iOS: detect screenshot via rapid resize events
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      blurAll();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(unblurAll, 1500);
    };

    // Detect screen recording via Screen Capture API
    const checkScreenCapture = () => {
      if (typeof navigator !== "undefined" && "mediaDevices" in navigator) {
        const md = navigator.mediaDevices as EventTarget;
        md.addEventListener("devicechange", () => {
          blurAll();
          setTimeout(unblurAll, 2000);
        });
      }
    };
    checkScreenCapture();

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimeout);
    };
  }, []);
}

// ── Fullscreen Reader ──
function FullscreenReader({ onClose }: { onClose: () => void }) {
  const totalPages = ebookConfig.pages;
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rest-ebook-page");
      if (saved) {
        const page = parseInt(saved, 10);
        if (page >= 1 && page <= ebookConfig.pages) return page;
      }
    }
    return 1;
  });
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef({ startX: 0, startY: 0, startTime: 0, isEdgeGesture: false });
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const touchHandledRef = useRef(false);

  const pageUrl = (n: number) => `/ebooks/pages/${n}.jpg`;

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem("rest-ebook-page", String(currentPage));
  }, [currentPage]);

  // Preload current + adjacent pages
  useEffect(() => {
    const pages = [currentPage];
    if (currentPage > 1) pages.push(currentPage - 1);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    pages.forEach(p => {
      const img = new Image();
      img.src = pageUrl(p);
    });
  }, [currentPage, totalPages]);

  // First page loaded → hide spinner
  useEffect(() => {
    const savedPage = localStorage.getItem("rest-ebook-page");
    const startPage = savedPage ? parseInt(savedPage, 10) : 1;
    const img = new Image();
    img.onload = () => setLoading(false);
    img.onerror = () => setLoading(false);
    img.src = pageUrl(startPage);
  }, []);

  // Auto-hide bars
  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowBottomBar(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, []);

  // Lock body scroll + hide bottom nav
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const bottomNav = document.querySelector("nav.lg\\:hidden.fixed.bottom-0") as HTMLElement;
    if (bottomNav) bottomNav.style.display = "none";
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = "";
      if (bottomNav) bottomNav.style.display = "";
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentPage(p => Math.min(p + 1, totalPages));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentPage(p => Math.max(p - 1, 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages, onClose]);

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("[data-scrubber]")) return;

    const touch = e.touches[0];
    const vh = window.innerHeight;
    const isTopEdge = touch.clientY < 50;
    const isBottomEdge = touch.clientY > vh - 50;

    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isEdgeGesture: isTopEdge || isBottomEdge,
    };
    touchHandledRef.current = false;
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    if ((e.target as HTMLElement).closest("[data-scrubber]")) return;

    const touch = e.touches[0];
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;

    if (touchRef.current.isEdgeGesture) return;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
      let adjusted = dx;
      if (currentPage === 1 && dx > 0) adjusted = dx * 0.2;
      if (currentPage === totalPages && dx < 0) adjusted = dx * 0.2;
      setDragX(adjusted);
    }
  }, [isDragging, currentPage, totalPages]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    if ((e.target as HTMLElement).closest("[data-scrubber]")) {
      setIsDragging(false);
      return;
    }
    setIsDragging(false);
    touchHandledRef.current = true;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;
    const { startY } = touchRef.current;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const elapsed = Date.now() - touchRef.current.startTime;

    // Swipe from top edge → close reader
    if (startY < 60 && dy > 40 && Math.abs(dy) > Math.abs(dx)) {
      setDragX(0);
      onClose();
      return;
    }

    // Swipe from bottom edge → show bottom bar
    if (startY > vh - 50 && dy < -30 && Math.abs(dy) > Math.abs(dx)) {
      setShowBottomBar(true);
      scheduleHide();
      setDragX(0);
      return;
    }

    // Tap → navigate or toggle bars
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && elapsed < 300) {
      if (showBottomBar) {
        setShowBottomBar(false);
        setDragX(0);
        return;
      }
      const tapX = touch.clientX;
      if (tapX > vw * 0.5) {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
      } else {
        if (currentPage > 1) setCurrentPage(p => p - 1);
      }
      setDragX(0);
      return;
    }

    // Horizontal swipe → page turn
    const threshold = vw * 0.2;
    const velocity = Math.abs(dx) / elapsed;

    if (dx < -threshold || (dx < -30 && velocity > 0.4)) {
      if (currentPage < totalPages) setCurrentPage(p => p + 1);
    } else if (dx > threshold || (dx > 30 && velocity > 0.4)) {
      if (currentPage > 1) setCurrentPage(p => p - 1);
    }

    setDragX(0);
  }, [isDragging, currentPage, totalPages, showBottomBar, scheduleHide, onClose]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    scheduleHide();
  }, [totalPages, scheduleHide]);

  // Click only for desktop — skip if touch already handled
  const onClick = useCallback((e: React.MouseEvent) => {
    if (touchHandledRef.current) {
      touchHandledRef.current = false;
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[data-scrubber]") || target.closest("input")) return;
    if (showBottomBar) {
      setShowBottomBar(false);
      return;
    }
    const vw = window.innerWidth;
    if (e.clientX > vw * 0.5) {
      if (currentPage < totalPages) setCurrentPage(p => p + 1);
    } else {
      if (currentPage > 1) setCurrentPage(p => p - 1);
    }
  }, [currentPage, totalPages, showBottomBar]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#060E0E] cursor-pointer"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
      data-protected
      style={{ userSelect: "none", WebkitUserSelect: "none", touchAction: "none", overscrollBehavior: "none", height: "100dvh" }}
    >
      {/* Page content */}
      <div
        className="w-full flex items-center justify-center overflow-hidden relative"
        style={{
          height: "100dvh",
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <img
          src={pageUrl(currentPage)}
          alt={`Página ${currentPage}`}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
        {/* Mask white PDF margins */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#060E0E]" />
        <div className="absolute top-0 left-0 right-0 h-4 bg-[#060E0E]" />
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-4">
          <div className="w-10 h-10 border-2 border-rest-accent/20 border-t-rest-accent rounded-full animate-spin" />
          <p className="text-white/40 text-xs">Cargando ebook...</p>
        </div>
      )}

      {/* Page counter — always visible */}
      {!loading && !showBottomBar && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white/70 text-xs font-medium">{currentPage}</span>
            <span className="text-white/30 text-xs"> / {totalPages}</span>
          </div>
        </div>
      )}

      {/* Anti-screenshot watermark overlay */}
      <div
        className="absolute inset-0 z-[105] pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 200px,
            rgba(0,229,160,0.015) 200px,
            rgba(0,229,160,0.015) 201px
          )`,
          mixBlendMode: "difference",
        }}
      >
        <div className="w-full h-full flex flex-wrap items-center justify-center gap-40 overflow-hidden opacity-[0.03] rotate-[-30deg] scale-150">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="text-white text-sm font-bold whitespace-nowrap tracking-widest">
              MÉTODO R.E.S.T. © {ebookConfig.author}
            </span>
          ))}
        </div>
      </div>

      {/* Top swipe hint — swipe down to close */}
      <div className="absolute top-0 left-0 right-0 z-[110] pointer-events-none">
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Bottom bar — swipe up from bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[110] transition-all duration-300 ease-out ${
          showBottomBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent px-5 pt-12 pb-10">
          <div className="text-center mb-4">
            <span className="text-white text-base font-semibold">{currentPage}</span>
            <span className="text-white/40 text-base"> / {totalPages}</span>
          </div>

          <div data-scrubber className="relative px-2" style={{ touchAction: "auto" }}>
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => goToPage(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-white/15 rounded-full outline-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-rest-accent
                [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0,229,160,0.4)]
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-rest-accent/30"
            />
            <div className="flex justify-between mt-2 text-[10px] text-white/30 px-1">
              <span>1</span>
              <span>{Math.round(totalPages * 0.25)}</span>
              <span>{Math.round(totalPages * 0.5)}</span>
              <span>{Math.round(totalPages * 0.75)}</span>
              <span>{totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cover Placeholder ──
function CoverPlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-rest-accent/20 to-rest-accent/5 flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-rest-accent/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <p className="text-rest-accent font-[family-name:var(--font-space)] text-2xl font-bold">R.E.S.T.</p>
      <p className="text-rest-text-muted text-xs mt-1">MÉTODO</p>
      <p className="text-rest-text-muted/50 text-[10px] mt-4">Portada pendiente</p>
    </div>
  );
}

// ── Main Page ──
export default function EbookPage() {
  const [reading, setReading] = useState(false);
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);
  const [coverExists, setCoverExists] = useState<boolean | null>(null);

  useContentProtection();

  useEffect(() => {
    const saved = localStorage.getItem("rest-ebook-page");
    if (saved) {
      const page = parseInt(saved, 10);
      if (page > 1 && page <= ebookConfig.pages) setReading(true);
    }
  }, []);

  useEffect(() => {
    fetch(ebookConfig.pdfFile, { method: "HEAD" })
      .then((res) => setPdfExists(res.ok))
      .catch(() => setPdfExists(false));
    fetch(ebookConfig.coverImage, { method: "HEAD" })
      .then((res) => setCoverExists(res.ok))
      .catch(() => setCoverExists(false));
  }, []);

  if (reading) {
    return <FullscreenReader onClose={() => setReading(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Tu Ebook</h1>
        <p className="text-rest-text-muted mt-1">Lectura exclusiva en plataforma</p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl glass-card">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="shrink-0 max-w-[220px] sm:max-w-[260px] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,229,160,0.1)]">
            {coverExists ? (
              <img src={ebookConfig.coverImage} alt={ebookConfig.title} className="w-full h-auto" />
            ) : (
              <CoverPlaceholder />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-rest-accent text-xs uppercase tracking-widest mb-2">Ebook digital</p>
            <h2 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-bold mb-2 text-white">
              {ebookConfig.title}
            </h2>
            <p className="text-rest-text-secondary text-sm mb-1">{ebookConfig.subtitle}</p>
            <p className="text-rest-text-muted text-xs mb-1">
              por {ebookConfig.author} — {ebookConfig.authorRole}
            </p>
            <p className="text-rest-text-muted text-xs mb-6">{ebookConfig.pages} páginas</p>
            <button
              onClick={() => setReading(true)}
              className="px-8 py-3.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.4)] hover:scale-105 inline-flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Leer ahora
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-[#2A1F5E]/30 to-[#3B2D7A]/20 border border-[#C9A84C]/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/15 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1 text-[#E8D5A0]">Contenido protegido</p>
            <p className="text-[#A89BC2] text-[11px] leading-relaxed">
              Este ebook está disponible exclusivamente para lectura dentro de la plataforma. No es descargable.
              El contenido incluye protección digital vinculada a tu cuenta.
            </p>
          </div>
        </div>
      </div>

      {(pdfExists === false || coverExists === false) && (
        <div className="p-5 rounded-2xl bg-rest-accent/5">
          <h3 className="font-medium text-sm text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Configuración del ebook
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${coverExists ? "bg-rest-accent" : "border-2 border-rest-accent/20"}`}>
                {coverExists && (
                  <svg className="w-3 h-3 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm text-rest-text-secondary">Imagen de portada</p>
                <code className="text-rest-accent/60 text-[10px]">public{ebookConfig.coverImage}</code>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${pdfExists ? "bg-rest-accent" : "border-2 border-rest-accent/20"}`}>
                {pdfExists && (
                  <svg className="w-3 h-3 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm text-rest-text-secondary">Archivo PDF</p>
                <code className="text-rest-accent/60 text-[10px]">public{ebookConfig.pdfFile}</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
