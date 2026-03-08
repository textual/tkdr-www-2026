"use client";

// components/ui/SectionHeader.tsx

interface SectionHeaderProps {
  /** Short index label e.g. "01" */
  index?: string;
  /** Main section title */
  label: string;
  /** Optional count shown at the right end of the rule */
  count?: number;
}

export function SectionHeader({ index, label, count }: SectionHeaderProps) {
  return (
    <>
      <style>{`
        .sh-root {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          font-family: 'Chakra Petch', sans-serif;
        }

        .sh-index {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #ba1111;
          flex-shrink: 0;
        }

        .sh-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          flex-shrink: 0;
        }

        .sh-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            to right,
            hsl(var(--border)),
            transparent
          );
        }

        .sh-count {
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: hsl(var(--muted-foreground));
          flex-shrink: 0;
          opacity: 0.6;
        }
      `}</style>

      <div className="sh-root">
        {index && <span className="sh-index">{index}</span>}
        <span className="sh-label">{label}</span>
        <div className="sh-rule" />
        {count !== undefined && (
          <span className="sh-count">{count} results</span>
        )}
      </div>
    </>
  );
}
