import Link from "next/link";
import type { ReactNode } from "react";

// Renderiza inline: **negrita**, [texto](url), y los tags [EVIDENCIA FIRME] etc.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // token regex: **bold** | [label](url)
  const re = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      const inner = tok.slice(2, -2);
      const tagMatch = inner.match(/^\[(EVIDENCIA FIRME|RAZONAMIENTO MECANICISTA|DEBATIDO)\]$/);
      if (tagMatch) {
        const label = tagMatch[1];
        const color =
          label === "EVIDENCIA FIRME"
            ? "text-rest-accent"
            : label === "DEBATIDO"
              ? "text-rest-text-muted"
              : "text-white/70";
        nodes.push(
          <span
            key={`${keyPrefix}-t${i}`}
            className={`inline-block font-[family-name:var(--font-space)] text-[0.65rem] font-semibold tracking-[0.12em] uppercase mr-1 align-middle ${color}`}
          >
            [{label}]
          </span>,
        );
      } else {
        nodes.push(
          <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-white">
            {inner}
          </strong>,
        );
      }
    } else {
      // link
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (lm) {
        const [, label, url] = lm;
        const external = /^https?:\/\//.test(url);
        if (external) {
          nodes.push(
            <a
              key={`${keyPrefix}-l${i}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-inline"
            >
              {label}
            </a>,
          );
        } else {
          nodes.push(
            <Link key={`${keyPrefix}-l${i}`} href={url} className="link-inline">
              {label}
            </Link>,
          );
        }
      } else {
        nodes.push(tok);
      }
    }
    last = re.lastIndex;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/);
  const out: ReactNode[] = [];

  blocks.forEach((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("### ")) {
      out.push(
        <h3
          key={bi}
          className="font-[family-name:var(--font-space)] text-lg font-semibold text-white mt-8 mb-2"
        >
          {renderInline(trimmed.replace(/^###\s+/, ""), `h3-${bi}`)}
        </h3>,
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      out.push(
        <h2
          key={bi}
          className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white mt-10 mb-3"
        >
          {renderInline(trimmed.replace(/^##\s+/, ""), `h2-${bi}`)}
        </h2>,
      );
      return;
    }

    // Lista con viñetas (líneas que empiezan con "- ")
    const listLines = trimmed.split("\n");
    if (listLines.every((l) => l.trim().startsWith("- "))) {
      out.push(
        <ul key={bi} className="list-disc pl-5 space-y-2 my-4">
          {listLines.map((l, li) => (
            <li key={li}>{renderInline(l.trim().replace(/^-\s+/, ""), `li-${bi}-${li}`)}</li>
          ))}
        </ul>,
      );
      return;
    }

    // Lista numerada
    if (listLines.every((l) => /^\d+\.\s/.test(l.trim()))) {
      out.push(
        <ol key={bi} className="list-decimal pl-5 space-y-2 my-4">
          {listLines.map((l, li) => (
            <li key={li}>{renderInline(l.trim().replace(/^\d+\.\s+/, ""), `ol-${bi}-${li}`)}</li>
          ))}
        </ol>,
      );
      return;
    }

    // Párrafo (puede tener saltos simples internos)
    out.push(
      <p key={bi} className="my-4 leading-relaxed">
        {renderInline(trimmed.replace(/\n/g, " "), `p-${bi}`)}
      </p>,
    );
  });

  return <>{out}</>;
}
