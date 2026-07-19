import { useState, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { SkipLink } from "@/components/Common/SkipLink";

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SkipLink />
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="mx-auto flex w-full max-w-[1400px]">
        <Sidebar />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
