"use client";

import { Badge } from "@/components/ui/Badge";
import { PanelSkeleton, PanelEmpty, PanelError } from "../PanelStates";
import { useAccountProducts } from "@/lib/queries/useAccountPanels";
import { type AccountProduct } from "@/types";

export function ProductsPanel({ accountId }: { accountId: number }) {
  const { data, isLoading, error } = useAccountProducts(accountId);

  if (isLoading) return <PanelSkeleton rows={2} />;
  if (error) return <PanelError message="Could not load products." />;
  if (!data?.length)
    return <PanelEmpty message="No products on record for this account." />;

  return (
    <ul className="acct-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {data.map((product: AccountProduct) => (
        <li key={product.id} className="acct-list-row">
          <div>
            <div className="acct-list-name">{product.name}</div>
            {product.description && (
              <div className="acct-list-sub">{product.description}</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {product.premium__c && <Badge label="Premium" variant="brand" />}
            <Badge label={product.category} variant="muted" />
          </div>
        </li>
      ))}
      <style>{`
        .acct-list-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid hsl(var(--border));
          font-size: 0.8rem;
        }
        .acct-list-row:last-child { border-bottom: none; }
        .acct-list-name { font-weight: 500; color: hsl(var(--foreground)); }
        .acct-list-sub { font-size: 0.7rem; color: hsl(var(--muted-foreground)); margin-top: 2px; }
      `}</style>
    </ul>
  );
}
