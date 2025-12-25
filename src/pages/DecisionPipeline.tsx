import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import {
  GitBranch,
  Database,
  Sparkles,
  Filter,
  BarChart3,
  Shield,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";

const pipelineSteps = [
  {
    icon: Database,
    title: "Market Data Intake",
    description: "Real-time streams from 50+ exchanges across all asset classes",
  },
  {
    icon: Sparkles,
    title: "Cleaning & Normalization",
    description: "Remove noise, fill gaps, standardize formats for analysis",
  },
  {
    icon: BarChart3,
    title: "Pattern & Feature Detection",
    description: "AI identifies technical patterns, candlestick formations, and statistical anomalies",
  },
  {
    icon: GitBranch,
    title: "Cross-Asset Context",
    description: "Correlations, risk-on/off signals, sector rotation detection",
  },
  {
    icon: Filter,
    title: "Strategy Filter",
    description: "Route opportunities to optimal engine: Nuvex, Xylo, Drav, Yark, Tenzor, or Omnix",
  },
  {
    icon: Shield,
    title: "Risk Engine",
    description: "Max risk limits, leverage caps, drawdown protection, correlation checks",
  },
  {
    icon: Zap,
    title: "Execution Signal",
    description: "Precise entry price, position sizing, and order type determination",
  },
  {
    icon: Settings,
    title: "Position Management",
    description: "Trail stops, scale-in opportunities, partial profit taking",
  },
  {
    icon: LogOut,
    title: "Exit Logic",
    description: "Target hit, stop triggered, time exit, or regime change detection",
  },
];

export default function DecisionPipeline() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <GitBranch className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              The Algofi <span className="text-primary text-glow">Decision Pipeline</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every trade passes through this institutional logic. Zero shortcuts.
          </p>
        </div>

        {/* Pipeline Flow */}
        <div className="max-w-3xl mx-auto">
          <GlassCard>
            <FlowDiagram steps={pipelineSteps} />
          </GlassCard>
        </div>

        {/* Key Highlights */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard hover>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display font-bold text-lg mb-2">12ms Latency</h4>
              <p className="text-sm text-muted-foreground">
                From signal generation to order placement in milliseconds
              </p>
            </div>
          </GlassCard>

          <GlassCard hover>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display font-bold text-lg mb-2">Multi-Layer Risk</h4>
              <p className="text-sm text-muted-foreground">
                Position, portfolio, and systemic risk checks at every stage
              </p>
            </div>
          </GlassCard>

          <GlassCard hover>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Filter className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display font-bold text-lg mb-2">6 Strategy Engines</h4>
              <p className="text-sm text-muted-foreground">
                Each opportunity routed to its optimal trading strategy
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
