import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="grid-pattern fixed inset-0 pointer-events-none opacity-30" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
      
    </div>
  );
}
