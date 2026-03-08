import SideBar from "@/components/layout/SideBar";

export default function MainDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <SideBar>{children}</SideBar>
    </div>
  );
}
