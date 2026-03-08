"use client";

import { useState } from "react";
import {
  Menu,
  X,
  House,
  MapPinned,
  Ticket,
  Search,
  Settings,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { HOME_URL, SETTINGS_URL } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { LocationBanner } from "../home/locationBanner";

const NavItemWrapper = ({ isMobile, children }) => {
  if (isMobile) {
    return <SheetClose asChild>{children}</SheetClose>;
  }
  return <>{children}</>;
};

const SidebarContent = ({ pathname, isMobile = false }) => {
  const menuItems = [
    { name: "Home", href: HOME_URL, icon: House },
    { name: "Tracks", href: "/tracks", icon: MapPinned },
    { name: "Tracks 2", href: "/tracks-2", icon: MapPinned },
    { name: "Events", href: "/events", icon: Ticket },
    { name: "Search", href: "/search", icon: Search },
    { name: "Settings", href: SETTINGS_URL, icon: Settings },
    { name: "Settings 2", href: `${SETTINGS_URL}-2`, icon: Settings },
  ];
  return (
    <nav className="flex flex-col z-100">
      <div className="p-4 bg-sidebar-accent border-sidebar-border">
        <LocationBanner mode="sidebar" />
      </div>

      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <NavItemWrapper key={item.href} isMobile={isMobile}>
            <Link
              href={item.href}
              className={`nav-item${isActive ? " active" : ""}`}
            >
              <Icon className="nav-item-icon" size={16} />
              <div className="nav-item-label">{item.name}</div>
            </Link>
          </NavItemWrapper>
        );
      })}
    </nav>
  );
};

export default function SideBar({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-layout-background border-r border-brand">
        <Logo />
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Hamburger */}
        <header className="md:hidden flex items-center gap-2 p-4 bg-layout-background border-b border-gray-200">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-8">
              <SheetTitle className="mb-4">
                <Logo />
              </SheetTitle>
              <SidebarContent pathname={pathname} isMobile={true} />
            </SheetContent>
          </Sheet>
          <Logo />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
