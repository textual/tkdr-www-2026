import Navigation from "@/components/layout/Navigation";

export default function NewDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <Navigation />
      <main className="app-main bg-layout-background">{children}</main>
    </div>
  );
}
