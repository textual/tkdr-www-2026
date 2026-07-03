"use client";

import { useParams } from "next/navigation";

import { useAccount } from "@/lib/queries/useAccount";
import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountPanel } from "@/components/account/AccountPanel";
import { getAccountPanels } from "@/components/account/panelRegistry";

export default function AccountPage() {
  const params = useParams<{ slug: string }>();
  const { data: account, isLoading, error } = useAccount(params.slug);

  if (isLoading) {
    return <div className="account-page">Loading account…</div>;
  }

  if (error || !account) {
    return <div className="account-page">Could not load this account.</div>;
  }

  const panels = getAccountPanels(account.recordtypename, account.offerings);

  return (
    <>
      <style>{`
        .account-page {
          max-width: 680px;
          padding: 48px 32px;
          font-family: 'Chakra Petch', sans-serif;
        }
        @media (max-width: 480px) {
          .account-page { padding: 32px 16px; }
        }
      `}</style>

      <div className="account-page">
        <AccountHeader account={account} />

        {panels.length === 0 ? (
          <p
            style={{
              fontSize: "0.75rem",
              color: "hsl(var(--muted-foreground))",
              marginTop: 16,
            }}
          >
            No offerings on record for this account yet.
          </p>
        ) : (
          panels.map(({ key, label, Component }, i) => (
            <AccountPanel
              key={key}
              index={String(i + 1).padStart(2, "0")}
              label={label}
              count={account.offerings[key]?.count}
              defaultOpen={i === 0}
            >
              <Component accountId={account.id} />
            </AccountPanel>
          ))
        )}
      </div>
    </>
  );
}
