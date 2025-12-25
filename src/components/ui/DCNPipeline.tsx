import { cn } from "@/lib/utils";
import { 
  Brain, Database, Newspaper, GitBranch, Droplets, TrendingUp,
  Scan, Target, Layers, Star, Route, CheckCircle2, XCircle,
  Activity, Shield, PieChart, Compass, ArrowRight, Zap,
  DollarSign, Clock, LineChart, AlertTriangle, LogOut
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DCNPipelineProps {
  className?: string;
}

interface PipelineStep {
  icon: LucideIcon;
  label: string;
  status?: "active" | "pending" | "complete";
}

export function DCNPipeline({ className }: DCNPipelineProps) {
  const decisionInputs: PipelineStep[] = [
    { icon: Database, label: "Price Feeds", status: "active" },
    { icon: Layers, label: "Orderbook Depth", status: "active" },
    { icon: Newspaper, label: "News Sentiment", status: "complete" },
    { icon: GitBranch, label: "Correlations", status: "active" },
    { icon: Droplets, label: "Liquidity Maps", status: "pending" },
    { icon: TrendingUp, label: "Macro Shifts", status: "complete" },
  ];

  const aiModules: PipelineStep[] = [
    { icon: Scan, label: "Feature Extraction" },
    { icon: Target, label: "Pattern Detection" },
    { icon: Layers, label: "Regime Classification" },
    { icon: Star, label: "Opportunity Scoring" },
  ];

  const confirmationChecks = [
    { label: "Volatility within range", passed: true },
    { label: "Spread acceptable", passed: true },
    { label: "Macro environment supports", passed: true },
    { label: "Strategies aligned", passed: false },
    { label: "Portfolio exposure safe", passed: true },
    { label: "Risk engine approved", passed: true },
  ];

  const navigationSteps: PipelineStep[] = [
    { icon: DollarSign, label: "Entry Price Selection" },
    { icon: Route, label: "Order Placement" },
    { icon: PieChart, label: "Position Sizing" },
    { icon: Activity, label: "Live Management" },
    { icon: LineChart, label: "Trailing Logic" },
    { icon: Clock, label: "Time-based Exit" },
    { icon: Compass, label: "Dynamic Stop" },
    { icon: AlertTriangle, label: "Regime Monitor" },
    { icon: LogOut, label: "Exit Trigger" },
  ];

  const tradeLifecycle = ["Signal", "Verify", "Execute", "Manage", "Close", "Log"];

  return (
    <div className={cn("space-y-12", className)}>
      {/* D = Decision Layer */}
      <div className="glass rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">
              <span className="text-primary">D</span> = Decision Layer
            </h3>
            <p className="text-muted-foreground text-sm">AI Thinks & Processes</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <h4 className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Inputs</h4>
            <div className="space-y-2">
              {decisionInputs.map((item, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    item.status === "active" 
                      ? "bg-primary/5 border-primary/30 animate-pulse-slow" 
                      : item.status === "complete"
                      ? "bg-card border-border"
                      : "bg-muted/30 border-border/50"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4",
                    item.status === "active" ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="text-sm">{item.label}</span>
                  {item.status === "active" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Processing */}
          <div className="space-y-4">
            <h4 className="text-sm text-muted-foreground uppercase tracking-wider font-medium">AI Processing</h4>
            <div className="relative">
              {/* Neural flow visualization */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-32 h-32 rounded-full border-2 border-primary animate-pulse-slow" />
                <div className="absolute w-24 h-24 rounded-full border border-primary/50 animate-pulse" />
                <div className="absolute w-16 h-16 rounded-full bg-primary/20 animate-glow" />
              </div>
              
              <div className="relative space-y-2 py-4">
                {aiModules.map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{item.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto text-primary/50" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="space-y-4">
            <h4 className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Outputs</h4>
            <div className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Possible Trades</span>
                <span className="text-primary font-mono font-bold">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Confidence</span>
                <span className="text-primary font-mono font-bold">78%</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">Strategy Routing</div>
                <div className="flex flex-wrap gap-1">
                  {["Nuvex", "Drav", "Tenzor"].map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* C = Confirmation Layer */}
      <div className="glass rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-warning" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">
              <span className="text-warning">C</span> = Confirmation Layer
            </h3>
            <p className="text-muted-foreground text-sm">AI Validates & Approves</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {confirmationChecks.map((check, i) => (
            <div 
              key={i}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all",
                check.passed 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-destructive/5 border-destructive/20"
              )}
            >
              {check.passed ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              )}
              <span className="text-sm">{check.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium">
            5/6 Checks Passed → Trade Confirmed
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>

      {/* N = Navigation Layer */}
      <div className="glass rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">
              <span className="text-primary">N</span> = Navigation Layer
            </h3>
            <p className="text-muted-foreground text-sm">AI Executes & Manages</p>
          </div>
        </div>

        {/* Navigation Steps */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {navigationSteps.map((step, i) => (
            <div 
              key={i}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-center">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Trade Lifecycle */}
        <div className="pt-6 border-t border-border">
          <h4 className="text-sm text-muted-foreground uppercase tracking-wider font-medium mb-4 text-center">
            Trade Lifecycle
          </h4>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {tradeLifecycle.map((stage, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                  i === 2 
                    ? "bg-primary text-primary-foreground box-glow" 
                    : "bg-card border border-border"
                )}>
                  {stage}
                </div>
                {i < tradeLifecycle.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
