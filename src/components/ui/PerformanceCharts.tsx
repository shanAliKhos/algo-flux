import { GlassCard } from "./GlassCard";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";

interface YearlyPerformance {
  year: number;
  return: number;
  trades: number;
  winRate: number;
}

interface EquityCurvePoint {
  date: string;
  equity: number;
  drawdown: number;
}

interface DrawdownData {
  maxDrawdown: number;
  maxDrawdownDate: string;
  currentDrawdown: number;
  recoveryTime: number;
  drawdownHistory: Array<{
    date: string;
    drawdown: number;
  }>;
}

interface RiskMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  totalTrades: number;
}

interface StrategyContribution {
  strategy: string;
  return: number;
  trades: number;
  winRate: number;
  sharpeRatio: number;
}

export function YearlyPerformanceChart({ yearlyPerformance }: { yearlyPerformance?: YearlyPerformance[] }) {
  // Transform data for chart
  const chartData = yearlyPerformance?.map((item) => ({
    year: item.year.toString(),
    return: item.return,
  })) || [];

  // Use default data if no data provided
  const data = chartData.length > 0 ? chartData : [
    { year: "Year 1", return: 42 },
    { year: "Year 2", return: 38 },
    { year: "Year 3", return: 57 },
    { year: "Year 4", return: 35 },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6">Yearly Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`+${value}%`, "Return"]}
            />
            <Bar
              dataKey="return"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              className="drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function EquityCurve({ equityCurve }: { equityCurve?: EquityCurvePoint[] }) {
  // Transform data for chart - use index as month if no date structure
  const chartData = equityCurve?.map((item, index) => ({
    month: index + 1,
    equity: item.equity,
    drawdown: item.drawdown,
  })) || [];

  // Use default data if no data provided
  const data = chartData.length > 0 ? chartData : Array.from({ length: 48 }, (_, i) => ({
    month: i + 1,
    equity: 100000 * Math.pow(1.035, i) + Math.sin(i * 0.5) * 5000,
    volatilityZone: i >= 20 && i <= 28 ? 100000 * Math.pow(1.035, i) : null,
  }));

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6">Equity Curve</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="volatilityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `M${v}`} />
            <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Equity"]}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Stable Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Volatility Zone</span>
        </div>
      </div>
    </GlassCard>
  );
}

export function DrawdownPanel({ drawdownData }: { drawdownData?: DrawdownData }) {
  // Transform drawdown history for chart
  // Use the date field as period label (e.g., "Q1 Y1") and drawdown value
  // Each period has its own recovery time
  const chartData = drawdownData?.drawdownHistory?.map((item) => ({
    period: item.date || `Q1 Y1`, // Use date field as period label
    drawdown: item.drawdown,
    recovery: (item as any).recovery || drawdownData.recoveryTime || 0, // Use period-specific recovery or fallback to global
  })) || [];

  // Use default data if no data provided
  const data = chartData.length > 0 ? chartData : [
    { period: "Q1 Y1", drawdown: -8, recovery: 15 },
    { period: "Q2 Y1", drawdown: -5, recovery: 8 },
    { period: "Q3 Y1", drawdown: -12, recovery: 22 },
    { period: "Q4 Y1", drawdown: -6, recovery: 10 },
    { period: "Q1 Y2", drawdown: -9, recovery: 18 },
    { period: "Q2 Y2", drawdown: -7, recovery: 12 },
    { period: "Q3 Y2", drawdown: -15, recovery: 28 },
    { period: "Q4 Y2", drawdown: -4, recovery: 6 },
    { period: "Q1 Y3", drawdown: -11, recovery: 20 },
    { period: "Q2 Y3", drawdown: -6, recovery: 9 },
    { period: "Q3 Y3", drawdown: -8, recovery: 14 },
    { period: "Q4 Y3", drawdown: -5, recovery: 7 },
  ];

  const maxDrawdown = drawdownData?.maxDrawdown || -12.5;
  const maxDrawdownRange = `${Math.abs(maxDrawdown) - 5}% – ${Math.abs(maxDrawdown) + 5}%`;

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-2">Drawdown Analysis</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Max drawdown: {maxDrawdown.toFixed(2)}% • Range: {maxDrawdownRange}
      </p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            <Bar dataKey="drawdown" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Drawdown" />
            <Bar dataKey="recovery" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Recovery Days" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function RiskMetricsCards({ riskMetrics }: { riskMetrics?: RiskMetrics }) {
  // Calculate derived metrics
  const avgRR = riskMetrics 
    ? (Math.abs(riskMetrics.averageWin) / Math.abs(riskMetrics.averageLoss || 1)).toFixed(1)
    : "2.4";
  // Profit Consistency = Win Rate (percentage of trades that are profitable)
  // This represents how consistently the strategy produces winning trades
  const profitConsistency = riskMetrics && riskMetrics.totalTrades > 0
    ? riskMetrics.winRate.toFixed(0)
    : "92";

  const metrics = riskMetrics ? [
    { label: "Sharpe Ratio", value: riskMetrics.sharpeRatio.toFixed(2) },
    { label: "Sortino Ratio", value: riskMetrics.sortinoRatio.toFixed(2) },
    { label: "Win Rate", value: `${riskMetrics.winRate.toFixed(1)}%` },
    { label: "Average R:R", value: `1:${avgRR}` },
    { label: "Profit Consistency", value: `${profitConsistency}%` },
  ] : [
    { label: "Sharpe Ratio", value: "2.84" },
    { label: "Sortino Ratio", value: "3.21" },
    { label: "Monthly Win Rate", value: "78%" },
    { label: "Average R:R", value: "1:2.4" },
    { label: "Profit Consistency", value: "92%" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <GlassCard key={metric.label} className="p-4 text-center">
          <div className="text-2xl font-display font-bold text-primary mb-1">{metric.value}</div>
          <div className="text-xs text-muted-foreground">{metric.label}</div>
        </GlassCard>
      ))}
    </div>
  );
}

export function StrategyContributionTable({ strategyContributions }: { strategyContributions?: StrategyContribution[] }) {
  // Calculate total return for contribution percentage
  const totalReturn = strategyContributions?.reduce((sum, s) => sum + Math.abs(s.return), 0) || 1;
  
  // Transform data for display
  const contributions = strategyContributions?.map((strategy) => {
    const contribution = totalReturn > 0 ? (Math.abs(strategy.return) / totalReturn) * 100 : 0;
    return {
      name: strategy.strategy,
      contribution: Math.round(contribution),
      return: strategy.return,
      trades: strategy.trades,
      winRate: strategy.winRate,
      sharpeRatio: strategy.sharpeRatio,
    };
  }) || [];

  // Use default data if no data provided
  const data = contributions.length > 0 ? contributions : [
    { name: "Nuvex", contribution: 22, return: 48, trades: 0, winRate: 0, sharpeRatio: 0 },
    { name: "Drav", contribution: 18, return: 42, trades: 0, winRate: 0, sharpeRatio: 0 },
    { name: "Xylo", contribution: 15, return: 35, trades: 0, winRate: 0, sharpeRatio: 0 },
    { name: "Yark", contribution: 20, return: 45, trades: 0, winRate: 0, sharpeRatio: 0 },
    { name: "Tenzor", contribution: 14, return: 38, trades: 0, winRate: 0, sharpeRatio: 0 },
    { name: "Omnix", contribution: 11, return: 32, trades: 0, winRate: 0, sharpeRatio: 0 },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-xl font-bold mb-6">Strategy Contribution</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 text-sm text-muted-foreground font-medium">Strategy</th>
              <th className="text-center py-3 text-sm text-muted-foreground font-medium">Contribution</th>
              <th className="text-center py-3 text-sm text-muted-foreground font-medium">Trades</th>
              <th className="text-right py-3 text-sm text-muted-foreground font-medium">Return</th>
            </tr>
          </thead>
          <tbody>
            {data.map((strategy) => (
              <tr key={strategy.name} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 font-medium">{strategy.name}</td>
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(strategy.contribution * 4, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-primary">{strategy.contribution}%</span>
                  </div>
                </td>
                <td className="py-3 text-center text-muted-foreground">{strategy.trades || '-'}</td>
                <td className="py-3 text-right text-primary">+{strategy.return.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
