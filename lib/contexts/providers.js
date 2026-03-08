"use client";

// import { AuthProvider } from "./auth";
// import AuthWrapper from "./authWrapper";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeContext";
import { AppInfoProvider } from "./AppInfoContext";
import { LocationProvider } from "./LocationContext";

import { queryClient } from "@/lib/queryClient";

export const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AppInfoProvider>
      <LocationProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </LocationProvider>
    </AppInfoProvider>
  </QueryClientProvider>
);
