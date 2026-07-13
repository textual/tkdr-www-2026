"use client";

// components/search/SearchInput.tsx

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch?: () => void;
  className?: string;
  placeholder?: string;
}

// No `id` prop — both SideBar.jsx and Navigation.tsx render their shared
// nav body twice (desktop aside + mobile sheet), so a fixed id would
// duplicate in the DOM.
export function SearchInput({
  onSearch,
  className,
  placeholder = "Search",
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const trimmed = value.trim();
    if (!trimmed) return;

    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onSearch?.();
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
}
