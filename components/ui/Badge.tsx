"use client";

// components/ui/Badge.tsx

type BadgeVariant = "default" | "brand" | "muted" | "outline";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <>
      <style>{`
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 2px;
          white-space: nowrap;
          border: 1px solid transparent;
        }

        .badge-default {
          background: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          border-color: hsl(var(--border));
        }

        .badge-brand {
          background: rgba(186,17,17,0.12);
          color: #ba1111;
          border-color: rgba(186,17,17,0.25);
        }

        .badge-muted {
          background: transparent;
          color: hsl(var(--muted-foreground));
          border-color: hsl(var(--border));
        }

        .badge-outline {
          background: transparent;
          color: hsl(var(--foreground));
          border-color: hsl(var(--border));
        }
      `}</style>

      <span className={`badge badge-${variant}`}>{label}</span>
    </>
  );
}
