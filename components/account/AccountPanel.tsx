"use client";

// components/account/AccountPanel.tsx
//
// Collapsible section for the account page. Its children (a panel like
// <TracksPanel accountId={id} />) are only mounted into the tree the first
// time the section is opened — React doesn't call a component's function
// body (and therefore doesn't run its useQuery) until it's actually
// reconciled, so this is what makes each panel's data fetch lazy without
// any manual `enabled` plumbing between here and the query hooks.

import { useState } from "react";

import { SectionHeader } from "@/components/ui/SectionHeader";

interface AccountPanelProps {
  index: string;
  label: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccountPanel({
  index,
  label,
  count,
  defaultOpen = false,
  children,
}: AccountPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [everOpened, setEverOpened] = useState(defaultOpen);

  function toggle() {
    setOpen((o) => !o);
    setEverOpened((e) => e || true);
  }

  return (
    <>
      <style>{`
        .acct-panel {
          border-bottom: 1px solid hsl(var(--border));
          padding: 18px 0;
        }
        .acct-panel:last-child {
          border-bottom: none;
        }
        .acct-panel-trigger {
          width: 100%;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }
        .acct-panel-trigger > :first-child {
          flex: 1;
          margin-bottom: 0;
        }
        .acct-panel-chevron {
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
          transition: transform 0.15s ease;
          flex-shrink: 0;
        }
        .acct-panel-chevron-open {
          transform: rotate(180deg);
        }
        .acct-panel-body {
          padding-top: 14px;
        }
      `}</style>

      <div className="acct-panel">
        <button className="acct-panel-trigger" onClick={toggle}>
          <SectionHeader index={index} label={label} count={count} />
          <span
            className={`acct-panel-chevron ${open ? "acct-panel-chevron-open" : ""}`}
          >
            ⌄
          </span>
        </button>

        {open && (
          <div className="acct-panel-body">{everOpened && children}</div>
        )}
      </div>
    </>
  );
}
