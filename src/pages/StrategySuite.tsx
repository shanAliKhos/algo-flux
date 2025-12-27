import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import {
  Layers,
  Target,
  BarChart3,
  TrendingUp,
  LineChart,
  Cpu,
  PieChart,
  ArrowRight,
  Clock,
  Shield,
  LucideIcon,
} from "lucide-react";

interface ApiStrategy {
  id?: string;
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
  tagline?: string;
  holdingTime?: string;
  assets?: string[];
  edge?: string;
  risk?: 'conservative' | 'balanced' | 'aggressive';
}

interface DisplayStrategy {
  name: string;
  icon: LucideIcon;
  tagline: string;
  assets: string[];
  holdingTime: string;
  edge: string;
  risk: "conservative" | "balanced" | "aggressive";
  instruments: string[];
  path: string;
  color: string;
}

// Icon mapping for strategies
const getStrategyIcon = (name: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    'Nuvex': Target,
    'Xylo': BarChart3,
    'Drav': TrendingUp,
    'Yark': LineChart,
    'Tenzor': Cpu,
    'Omnix': PieChart,
  };
  return iconMap[name] || Target;
};

// Color mapping for strategies
const getStrategyColor = (name: string): string => {
  const colorMap: Record<string, string> = {
    'Nuvex': 'from-green-500 to-emerald-600',
    'Xylo': 'from-blue-500 to-cyan-600',
    'Drav': 'from-orange-500 to-amber-600',
    'Yark': 'from-purple-500 to-violet-600',
    'Tenzor': 'from-red-500 to-rose-600',
    'Omnix': 'from-primary to-green-400',
  };
  return colorMap[name] || 'from-primary to-primary/80';
};

// Map API strategy to display format
const mapStrategyToDisplay = (strategy: ApiStrategy): DisplayStrategy => {
  // Use API fields if available, otherwise fall back to defaults
  const taglineMap: Record<string, string> = {
    'Nuvex': 'Institutional Reversal Engine',
    'Xylo': 'AI Market Maker',
    'Drav': 'Smart Money AI',
    'Yark': 'Quantitative Statistical Engine',
    'Tenzor': 'Momentum & Trend Engine',
    'Omnix': 'Multi-Factor Hedge Fund Brain',
  };

  const assetsMap: Record<string, string[]> = {
    'Nuvex': ['Forex', 'Gold', 'Indices', 'Stocks'],
    'Xylo': ['Forex Majors', 'Crypto', 'Gold'],
    'Drav': ['Forex', 'Indices', 'Gold'],
    'Yark': ['All Markets'],
    'Tenzor': ['Stocks', 'Indices', 'Crypto'],
    'Omnix': ['All Markets'],
  };

  const holdingTimeMap: Record<string, string> = {
    'Nuvex': 'Intraday / Swing',
    'Xylo': 'Scalping / Intraday',
    'Drav': 'Intraday / Swing',
    'Yark': 'Swing / Position',
    'Tenzor': 'Swing',
    'Omnix': 'All Timeframes',
  };

  // Map confidence to risk level if risk not provided
  const riskMap: Record<string, "conservative" | "balanced" | "aggressive"> = {
    'high': 'balanced',
    'medium': 'balanced',
    'low': 'aggressive',
  };

  return {
    name: strategy.name,
    icon: getStrategyIcon(strategy.name),
    tagline: strategy.tagline || taglineMap[strategy.name] || strategy.bias || 'AI Trading Strategy',
    assets: strategy.assets || assetsMap[strategy.name] || ['All Markets'],
    holdingTime: strategy.holdingTime || holdingTimeMap[strategy.name] || 'Variable',
    edge: strategy.edge || strategy.bias || 'AI-Powered Trading',
    risk: strategy.risk || riskMap[strategy.confidence] || 'balanced',
    instruments: strategy.instruments,
    path: `/strategy/${strategy.name.toLowerCase()}`,
    color: getStrategyColor(strategy.name),
  };
};

export default function StrategySuite() {
  const { data: apiStrategies = [], isLoading } = useQuery<ApiStrategy[]>({
    queryKey: ['strategies'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<ApiStrategy[]>('/strategies', true); // Public endpoint
        return response || [];
      } catch (error) {
        console.error('Failed to fetch strategies:', error);
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const strategies = apiStrategies.map(mapStrategyToDisplay);
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Layers className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              The Algofi <span className="text-primary text-glow">Strategy Suite</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six institutional-grade AI engines, one platform.
          </p>
        </div>

        {/* Strategy Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading strategies...</div>
          </div>
        ) : strategies.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">No strategies available</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
            <GlassCard key={strategy.name} hover className="group flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${strategy.color} flex items-center justify-center shadow-lg`}>
                  <strategy.icon className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">{strategy.name}</h3>
                  <p className="text-sm text-muted-foreground">{strategy.tagline}</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Asset Classes</p>
                  <div className="flex flex-wrap gap-1">
                    {strategy.assets.map((asset) => (
                      <span key={asset} className="px-2 py-0.5 text-xs bg-muted rounded">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{strategy.holdingTime}</span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Primary Edge</p>
                  <p className="text-sm font-medium">{strategy.edge}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <StatusBadge
                    risk={
                      strategy.risk === "conservative"
                        ? "low"
                        : strategy.risk === "balanced"
                        ? "medium"
                        : "high"
                    }
                    text={strategy.risk.charAt(0).toUpperCase() + strategy.risk.slice(1)}
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Typical Instruments</p>
                  <div className="flex flex-wrap gap-1">
                    {strategy.instruments.slice(0, 3).map((inst) => (
                      <span key={inst} className="px-2 py-0.5 text-xs font-mono bg-secondary rounded">
                        {inst}
                      </span>
                    ))}
                    {strategy.instruments.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-muted-foreground">
                        +{strategy.instruments.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                to={strategy.path}
                className="mt-6 flex items-center justify-center gap-2 py-3 rounded-lg border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-all group-hover:gap-3"
              >
                View Strategy Room
                <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
