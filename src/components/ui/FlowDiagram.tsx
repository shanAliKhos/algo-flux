import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FlowStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FlowDiagramProps {
  steps: FlowStep[];
}

export function FlowDiagram({ steps }: FlowDiagramProps) {
  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex items-start gap-6 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Node */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-card border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl border border-primary/50 animate-pulse-ring" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-2">
              <h4 className="font-display font-bold text-lg mb-1">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>

            {/* Glow connector */}
            {index < steps.length - 1 && (
              <div className="absolute left-8 top-16 h-8 w-0.5 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-primary to-transparent animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
