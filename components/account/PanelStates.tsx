"use client";

// components/account/PanelStates.tsx
// Shared loading / empty / error rows reused by every account panel.

export function PanelSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <>
      <style>{`
        .acct-panel-skel-row {
          height: 40px;
          border-radius: var(--radius);
          background: hsl(var(--muted));
          animation: acctShimmer 1.4s ease-in-out infinite;
          margin-bottom: 8px;
        }
        @keyframes acctShimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="acct-panel-skel-row" />
      ))}
    </>
  );
}

export function PanelEmpty({ message }: { message: string }) {
  return (
    <p
      style={{
        fontSize: "0.75rem",
        fontWeight: 300,
        fontStyle: "italic",
        color: "hsl(var(--muted-foreground))",
        padding: "8px 2px",
      }}
    >
      {message}
    </p>
  );
}

export function PanelError({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        border: "1px solid rgba(186,17,17,0.3)",
        borderRadius: "var(--radius)",
        background: "rgba(186,17,17,0.06)",
        fontSize: "0.75rem",
        color: "#ba1111",
      }}
    >
      {message}
    </div>
  );
}
