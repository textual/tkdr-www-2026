"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { useSearch } from "@/lib/queries/useSearch";
import { type Account } from "@/types";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div className="search-skeleton">
      <div className="skel skel-logo" />
      <div className="skel-body">
        <div className="skel skel-title" />
        <div className="skel skel-sub" />
      </div>
    </div>
  );
}

// ─── Coming-soon bucket ─────────────────────────────────────────────────────

function ComingSoonSection({ index, label }: { index: string; label: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader index={index} label={label} />
      <p className="search-coming-soon">Coming soon.</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const { data, isLoading, error } = useSearch(q);
  const accounts: Account[] = data?.accounts ?? [];

  return (
    <>
      <style>{`
        .search-page {
          max-width: 680px;
          padding: 48px 32px;
          font-family: 'Chakra Petch', sans-serif;
        }

        .search-eyebrow {
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #ba1111;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-eyebrow::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: #ba1111;
        }

        .search-heading {
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--foreground);
          margin-bottom: 6px;
          line-height: 1;
          word-break: break-word;
        }

        .search-subheading {
          font-size: 0.75rem;
          font-weight: 300;
          color: var(--muted-foreground);
          margin-bottom: 36px;
          letter-spacing: 0.03em;
        }

        .search-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 32px;
        }

        .search-skeleton {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }

        .skel {
          background: var(--muted);
          border-radius: 3px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }

        .skel-logo  { width: 48px; height: 48px; border-radius: calc(var(--radius) - 2px); flex-shrink: 0; }
        .skel-body  { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .skel-title { height: 14px; width: 55%; }
        .skel-sub   { height: 10px; width: 35%; }

        .search-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 56px 24px;
          color: var(--muted-foreground);
          text-align: center;
        }

        .search-empty-icon {
          font-size: 2rem;
          opacity: 0.3;
        }

        .search-empty-title {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--foreground);
          letter-spacing: 0.05em;
        }

        .search-empty-desc {
          font-size: 0.75rem;
          font-weight: 300;
          line-height: 1.6;
          font-style: italic;
        }

        .search-error {
          padding: 20px;
          border: 1px solid rgba(186,17,17,0.3);
          border-radius: var(--radius);
          background: rgba(186,17,17,0.06);
          font-size: 0.8rem;
          color: #ba1111;
          letter-spacing: 0.03em;
          margin-bottom: 32px;
        }

        .search-coming-soon {
          font-size: 0.75rem;
          font-weight: 300;
          font-style: italic;
          color: var(--muted-foreground);
        }

        @media (max-width: 480px) {
          .search-page { padding: 32px 16px; }
        }
      `}</style>

      <div className="search-page">
        <p className="search-eyebrow">Search</p>
        <h1 className="search-heading">
          {q ? `“${q}”` : "Search"}
        </h1>
        <p className="search-subheading">
          {q
            ? "Results across accounts, people, vehicles, and vehicle services."
            : "Type a query in the search box and press enter."}
        </p>

        {!q ? null : error ? (
          <div className="search-error">Could not load search results.</div>
        ) : (
          <>
            <SectionHeader
              index="01"
              label="Accounts"
              count={!isLoading ? accounts.length : undefined}
            />

            {isLoading ? (
              <div className="search-list">
                {[...Array(3)].map((_, i) => (
                  <ResultSkeleton key={i} />
                ))}
              </div>
            ) : accounts.length > 0 ? (
              <ul
                className="search-list"
                style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}
              >
                {accounts.map((account) => (
                  <li key={account.id}>
                    <SearchResultCard
                      account={account}
                      onClick={(a) => router.push(`/accounts/${a.slug__c}`)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="search-empty" style={{ marginBottom: 32 }}>
                <span className="search-empty-icon">◎</span>
                <p className="search-empty-title">No accounts found</p>
                <p className="search-empty-desc">
                  Try a different search term.
                </p>
              </div>
            )}

            <ComingSoonSection index="02" label="People" />
            <ComingSoonSection index="03" label="Vehicles" />
            <ComingSoonSection index="04" label="Vehicle Services" />
          </>
        )}
      </div>
    </>
  );
}
