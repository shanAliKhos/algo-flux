import { GlassCard } from "./GlassCard";
import { Globe, Server, ArrowDown, Check, Zap, Building2, Coins, TrendingUp } from "lucide-react";

const connectionNodes = [
  { id: "ld4", name: "London LD4", latency: "2ms", status: "active" },
  { id: "ny4", name: "New York NY4", latency: "8ms", status: "active" },
  { id: "sg1", name: "Singapore SG1", latency: "45ms", status: "active" },
  { id: "dubai", name: "Dubai Hub", latency: "32ms", status: "active" },
];

export function GlobalConnectivityMap() {
  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
        <Globe className="w-5 h-5 text-primary" />
        Global Connectivity Map
      </h3>
      <div className="relative h-64 rounded-lg bg-muted/20 border border-border overflow-hidden">
        {/* Central Algofi Node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse-slow">
            <Server className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-primary font-medium">
            Algofi Core
          </div>
        </div>

        {/* Connection Lines & Nodes */}
        {connectionNodes.map((node, i) => {
          const positions = [
            { x: "15%", y: "30%" },
            { x: "80%", y: "25%" },
            { x: "75%", y: "70%" },
            { x: "20%", y: "75%" },
          ];
          const pos = positions[i];

          return (
            <div key={node.id}>
              {/* Connection line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="50%"
                  y1="50%"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              </svg>

              {/* Node */}
              <div
                className="absolute flex flex-col items-center"
                style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
              >
                <div className="w-10 h-10 rounded-full bg-card border border-primary/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium">{node.name}</div>
                  <div className="text-xs text-primary">{node.latency}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary animate-data-flow"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

const executionSteps = [
  { label: "AI Creates Signal", icon: Zap },
  { label: "Risk Engine Checks", icon: Check },
  { label: "Broker Receives Order", icon: Server },
  { label: "Liquidity Matched", icon: TrendingUp },
  { label: "Broker Fills Order", icon: Check },
  { label: "Fill Returned to Algofi", icon: ArrowDown },
  { label: "Execution Quality Checked", icon: Check },
];

export function ExecutionFlowDiagram() {
  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6">Execution Flow</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

        <div className="space-y-4">
          {executionSteps.map((step, index) => (
            <div
              key={index}
              className="relative flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Node */}
              <div className="relative z-10 w-12 h-12 rounded-xl bg-card border border-primary/30 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>

              {/* Label */}
              <div className="flex-1 py-2 px-4 bg-muted/20 rounded-lg border border-border/50">
                <span className="text-sm font-medium">{step.label}</span>
              </div>

              {/* Animated connector */}
              {index < executionSteps.length - 1 && (
                <div className="absolute left-6 top-12 h-4 w-0.5 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-primary to-transparent animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

const connectivityCards = [
  {
    title: "Prime Brokers",
    icon: Building2,
    items: ["Goldman Sachs", "JP Morgan", "Morgan Stanley"],
  },
  {
    title: "ECN Aggregators",
    icon: Server,
    items: ["LMAX", "Currenex", "Integral"],
  },
  {
    title: "Liquidity Providers",
    icon: TrendingUp,
    items: ["XTX Markets", "Citadel", "Jump Trading"],
  },
  {
    title: "Crypto Exchanges",
    icon: Coins,
    items: ["Binance", "Coinbase Pro", "Kraken"],
  },
];

export function ConnectivityCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {connectivityCards.map((card) => (
        <GlassCard key={card.title} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <card.icon className="w-5 h-5 text-primary" />
            <h4 className="font-display font-bold">{card.title}</h4>
          </div>
          <ul className="space-y-2">
            {card.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      ))}
    </div>
  );
}

const qualityMetrics = [
  { label: "Execution Speed", value: "2.3ms", status: "excellent" },
  { label: "Avg Slippage", value: "0.2 pips", status: "excellent" },
  { label: "Requotes", value: "0.01%", status: "excellent" },
  { label: "Fill Accuracy", value: "99.8%", status: "excellent" },
];

export function ExecutionQualityPanel() {
  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6">Execution Quality</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {qualityMetrics.map((metric) => (
          <div key={metric.label} className="text-center p-4 bg-muted/20 rounded-lg border border-border/50">
            <div className="text-2xl font-display font-bold text-primary mb-1">{metric.value}</div>
            <div className="text-xs text-muted-foreground mb-2">{metric.label}</div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
              <Check className="w-3 h-3" />
              Excellent
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
