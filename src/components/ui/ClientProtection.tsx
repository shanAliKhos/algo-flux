import { GlassCard } from "./GlassCard";
import { Shield, Wallet, Eye, Server, ArrowRight, Check, Lock, AlertTriangle, RefreshCw, Download } from "lucide-react";

export function SegregatedAccountDiagram() {
  const layers = [
    {
      icon: Wallet,
      title: "Client Wallet",
      subtitle: "Segregated",
      description: "Your funds held separately",
      color: "primary",
    },
    {
      icon: Eye,
      title: "Algofi Risk Layer",
      subtitle: "Monitoring Only",
      description: "No access to funds, only risk oversight",
      color: "warning",
    },
    {
      icon: Server,
      title: "Broker Liquidity Pool",
      subtitle: "Execution Only",
      description: "Trade execution via prime brokers",
      color: "muted",
    },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Segregated Account Structure
      </h3>
      <div className="space-y-4">
        {layers.map((layer, index) => (
          <div key={layer.title}>
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  layer.color === "primary"
                    ? "bg-primary/20 border border-primary/30"
                    : layer.color === "warning"
                    ? "bg-warning/20 border border-warning/30"
                    : "bg-muted/30 border border-border"
                }`}
              >
                <layer.icon
                  className={`w-7 h-7 ${
                    layer.color === "primary"
                      ? "text-primary"
                      : layer.color === "warning"
                      ? "text-warning"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold">{layer.title}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {layer.subtitle}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{layer.description}</p>
              </div>
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            {index < layers.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-4 bg-gradient-to-b from-primary/50 to-primary/20" />
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function MoneyFlowDiagram() {
  const steps = [
    { label: "Deposit", icon: Wallet },
    { label: "Segregated Account", icon: Lock },
    { label: "Market Execution", icon: Server },
    { label: "Daily NAV", icon: RefreshCw },
    { label: "Withdrawal", icon: Download },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6">Money Flow</h3>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/50 min-w-[100px]">
              <step.icon className="w-6 h-6 text-primary" />
              <span className="text-xs text-center font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-primary/50 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

const protectionFeatures = [
  {
    icon: Lock,
    title: "Zero Commingling",
    description: "Client funds never mixed with operational capital",
  },
  {
    icon: Shield,
    title: "Automated Risk Controls",
    description: "Real-time position and exposure monitoring",
  },
  {
    icon: Eye,
    title: "Daily Exposure Monitoring",
    description: "24/7 risk surveillance and reporting",
  },
  {
    icon: Check,
    title: "Withdrawal Verification",
    description: "Multi-step verification for all withdrawals",
  },
  {
    icon: AlertTriangle,
    title: "DD Protection System",
    description: "Automatic risk reduction during drawdowns",
  },
];

export function ProtectionFeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {protectionFeatures.map((feature) => (
        <GlassCard key={feature.title} className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
