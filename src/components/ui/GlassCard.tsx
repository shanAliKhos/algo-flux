import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className, glow, hover }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        hover && "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10",
        glow && "border-primary/20 shadow-lg shadow-primary/10",
        className
      )}
    >
      {children}
    </div>
  );
}
