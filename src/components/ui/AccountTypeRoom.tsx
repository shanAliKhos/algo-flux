import { cn } from "@/lib/utils";
import { 
  Shield, TrendingUp, BarChart3, Activity, AlertTriangle,
  CheckCircle2, Sliders,
  Gauge, Target, PieChart, Zap, Settings, Eye, Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";

type AccountType = "retail-small" | "pro-retail" | "investor" | "vip-ultra";

interface AccountTypeRoomProps {
  type: AccountType;
  className?: string;
}

export function AccountTypeRoom({ type, className }: AccountTypeRoomProps) {
  // Fetch account rooms data dynamically
  const { data: accountRoomsData, error: accountRoomsError, isLoading, isFetching } = useQuery({
    queryKey: ['account-rooms'],
    queryFn: async () => {
      try {
        const data = await adminApi.getAccountRooms();
        return data;
      } catch (error) {
        console.error('Error fetching account rooms data:', error);
        return null;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  // Log errors for debugging
  if (accountRoomsError) {
    console.error('Account rooms query error:', accountRoomsError);
  }

  // Get dynamic config from database or use defaults
  const getConfig = () => {
    const defaults = {
      "retail-small": {
        title: "Retail Small Account",
        subtitle: "Safety-First Trading • $100–$3,000",
        color: "primary",
        icon: Shield,
      },
      "pro-retail": {
        title: "Pro Retail Account", 
        subtitle: "Advanced Control • $5,000–$50,000",
        color: "warning",
        icon: BarChart3,
      },
      "investor": {
        title: "Investor / Fund Account",
        subtitle: "Institutional Reporting • $50,000–$1M+",
        color: "primary",
        icon: TrendingUp,
      },
      "vip-ultra": {
        title: "VIP Ultra Account",
        subtitle: "Full Transparency • $1M+",
        color: "primary",
        icon: Target,
      }
    };

    if (!accountRoomsData) return defaults[type];

    switch (type) {
      case "retail-small":
        return {
          ...defaults["retail-small"],
          title: accountRoomsData.retailSmall?.title || defaults["retail-small"].title,
          subtitle: accountRoomsData.retailSmall?.subtitle || defaults["retail-small"].subtitle,
        };
      case "pro-retail":
        return {
          ...defaults["pro-retail"],
          title: accountRoomsData.proRetail?.title || defaults["pro-retail"].title,
          subtitle: accountRoomsData.proRetail?.subtitle || defaults["pro-retail"].subtitle,
        };
      case "investor":
        return {
          ...defaults["investor"],
          title: accountRoomsData.investor?.title || defaults["investor"].title,
          subtitle: accountRoomsData.investor?.subtitle || defaults["investor"].subtitle,
        };
      case "vip-ultra":
        return {
          ...defaults["vip-ultra"],
          title: accountRoomsData.vipUltra?.title || defaults["vip-ultra"].title,
          subtitle: accountRoomsData.vipUltra?.subtitle || defaults["vip-ultra"].subtitle,
        };
      default:
        return defaults[type];
    }
  };

  const config = getConfig();

  const renderRetailSmall = () => {
    const data = accountRoomsData?.retailSmall;
    const dailyRiskUsed = data?.dailyRiskUsed || 35;
    const maxDrawdown = data?.maxDrawdown || -5;
    const currentDrawdown = data?.currentDrawdown || -1.2;
    const leverageMode = data?.leverageMode || "Low: 1:10";
    const recentSignals = data?.recentSignals || [
      { emoji: "✅", text: "XAUUSD buy closed +$45" },
      { emoji: "⏳", text: "BTCUSDT watching..." },
      { emoji: "🛡️", text: "Risk limit: OK" },
    ];
    const safetyReasons = data?.safetyReasons || [
      "Low volatility environment",
      "Strong trend confirmation",
      "Risk only 0.5% of account",
      "Clear stop loss defined",
    ];
    const safeModeActive = data?.safeMode?.active ?? true;
    const safeModeDescription = data?.safeMode?.description || "All trades filtered through maximum safety protocols";

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Safe Mode */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Safe Mode</span>
            {safeModeActive && (
              <span className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                Active
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {safeModeDescription}
          </div>
        </div>

        {/* Daily Risk Meter */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-sm">Daily Risk Used</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${dailyRiskUsed}%` }} />
            </div>
            <span className="text-sm font-mono">{dailyRiskUsed}%</span>
          </div>
        </div>

        {/* Simple Signals */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-3">Recent Signals</div>
          <div className="space-y-2">
            {recentSignals.map((item, i) => {
              if (!item) return null;
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span>{item.emoji || ""}</span>
                  <span>{item.text || ""}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Safe */}
        <div className="glass rounded-xl p-4 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm">Why This Trade Was Safe</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {safetyReasons.filter(Boolean).map((reason, i) => (
              <li key={i}>• {reason}</li>
            ))}
          </ul>
        </div>

        {/* Max DD Protection */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-2">Max Drawdown Protection</div>
          <div className="text-2xl font-bold text-primary">{maxDrawdown}% max</div>
          <div className="text-xs text-muted-foreground mt-1">Currently at {currentDrawdown}%</div>
        </div>

        {/* Low Leverage */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-2">Leverage Mode</div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{leverageMode}</span>
            <span className="text-xs text-muted-foreground">Protected</span>
          </div>
        </div>
      </div>
    );
  };

  const renderProRetail = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Strategy Utilization */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">Strategy Utilization</div>
        <div className="space-y-2">
          {(accountRoomsData?.proRetail?.strategyUtilization || [
            { name: "Nuvex", percentage: 35 },
            { name: "Drav", percentage: 28 },
            { name: "Tenzor", percentage: 22 },
            { name: "Others", percentage: 15 },
          ]).map((s, i) => {
            const percentage = s.percentage ?? 0;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-16">{s.name || "Unknown"}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs font-mono w-8">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Quality */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm">Execution Quality</span>
        </div>
        <div className="text-3xl font-bold text-warning">
          {accountRoomsData?.proRetail?.executionQuality || 94.2}
        </div>
        <div className="text-xs text-muted-foreground">Out of 100 • Excellent</div>
      </div>

      {/* Market Regime */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">Market Regime</div>
        <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <div className="text-primary font-medium">
            {accountRoomsData?.proRetail?.marketRegime?.type || "Trending + Risk-On"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {accountRoomsData?.proRetail?.marketRegime?.description || "Favoring momentum strategies"}
          </div>
        </div>
      </div>

      {/* Opportunity Heatmap */}
      <div className="glass rounded-xl p-4 md:col-span-2">
        <div className="text-sm text-muted-foreground mb-3">Opportunity Heatmap</div>
        <div className="grid grid-cols-4 gap-2">
          {(accountRoomsData?.proRetail?.opportunityHeatmap || [
            { symbol: "XAUUSD", active: true },
            { symbol: "BTCUSDT", active: true },
            { symbol: "NAS100", active: true },
            { symbol: "EURUSD", active: true },
            { symbol: "TSLA", active: false },
            { symbol: "AAPL", active: false },
            { symbol: "ETH", active: false },
            { symbol: "GBPJPY", active: false },
          ]).map((item, i) => {
            if (!item || !item.symbol) return null;
            const isActive = item.active === true;
            return (
              <div 
                key={i}
                className={cn(
                  "p-2 rounded text-center text-xs",
                  isActive ? "bg-primary/30 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {item.symbol}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy Confidence */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">Strategy Confidence</div>
        <div className="space-y-1">
          {(accountRoomsData?.proRetail?.strategyConfidence || [
            { name: "Drav", confidence: "High" },
            { name: "Tenzor", confidence: "High" },
            { name: "Nuvex", confidence: "Medium" },
          ]).map((s, i) => {
            if (!s || !s.name) return null;
            const confidence = s.confidence || "Low";
            return (
              <div key={i} className="flex justify-between text-xs">
                <span>{s.name}</span>
                <span className={confidence === "High" ? "text-primary" : confidence === "Medium" ? "text-warning" : "text-muted-foreground"}>
                  {confidence}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderInvestor = () => {
    const data = accountRoomsData?.investor;
    
    // Always provide fallback values to ensure something is displayed
    const defaultDataPoints = [45, 52, 48, 58, 55, 62, 68, 65, 72, 78, 75, 82];
    const defaultAlphaSources = [
      { name: "Momentum", percentage: 38 },
      { name: "Mean Reversion", percentage: 28 },
      { name: "SMC/Liquidity", percentage: 22 },
      { name: "Statistical Arb", percentage: 12 },
    ];
    
    const ytdReturn = data?.equityCurve?.ytdReturn ?? 24.7;
    const dataPoints = (data?.equityCurve?.dataPoints && Array.isArray(data.equityCurve.dataPoints) && data.equityCurve.dataPoints.length > 0)
      ? data.equityCurve.dataPoints 
      : defaultDataPoints;
    const maxDrawdown = data?.drawdownZones?.maxDrawdown ?? -8.4;
    const currentDrawdown = data?.drawdownZones?.currentDrawdown ?? -2.1;
    const avgRecovery = data?.drawdownZones?.avgRecovery ?? 12;
    const sharpeRatio = data?.riskAdjustedMetrics?.sharpeRatio ?? 1.82;
    const sortinoRatio = data?.riskAdjustedMetrics?.sortinoRatio ?? 2.14;
    const calmarRatio = data?.riskAdjustedMetrics?.calmarRatio ?? 2.94;
    const alphaSources = (data?.alphaSources && Array.isArray(data.alphaSources) && data.alphaSources.length > 0)
      ? data.alphaSources
      : defaultAlphaSources;

    return (
      <div className="space-y-6">
        {/* Equity Curve */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Multi-Month Equity Curve</div>
              <div className="text-2xl font-bold text-primary">+{ytdReturn.toFixed(1)}% YTD</div>
            </div>
          </div>
          <div className="h-32 bg-card rounded-lg border border-border flex items-end p-2 gap-0.5 relative">
            {isFetching && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            )}
            {dataPoints && dataPoints.length > 0 ? (
              dataPoints.map((h, i) => {
                const height = Math.max(0, Math.min(100, Number(h) || 0)); // Clamp between 0-100
                return (
                  <div key={`chart-bar-${i}-${h}`} className="flex-1 flex items-end min-w-0 h-full">
                    <div 
                      className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/90"
                      style={{ 
                        height: `${height}%`, 
                        minHeight: height > 0 ? '4px' : '0px',
                        width: '100%',
                        opacity: height > 0 ? 0.7 : 0.3
                      }}
                      title={`Point ${i + 1}: ${height.toFixed(1)}%`}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                {isLoading ? 'Loading chart data...' : 'No chart data available'}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* DD Zones */}
          <div className="glass rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-3">Drawdown Zones</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Max DD</span>
                <span className="text-destructive">{maxDrawdown}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Current DD</span>
                <span className="text-warning">{currentDrawdown}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Avg Recovery</span>
                <span className="text-primary">{avgRecovery} days</span>
              </div>
            </div>
          </div>

          {/* Vol-Adjusted Returns */}
          <div className="glass rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-3">Risk-Adjusted Metrics</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Sharpe Ratio</span>
                <span className="text-primary">{sharpeRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Sortino Ratio</span>
                <span className="text-primary">{sortinoRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Calmar Ratio</span>
                <span className="text-primary">{calmarRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Alpha Sources */}
          <div className="glass rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-3">Alpha Sources</div>
            <div className="space-y-2">
              {alphaSources && alphaSources.length > 0 ? (
                alphaSources.filter(a => a && a.name).map((a, i) => {
                  const percentage = Math.max(0, Math.min(100, a.percentage ?? 0)); // Clamp between 0-100
                  return (
                    <div key={`alpha-${i}-${a.name}`} className="flex items-center gap-2">
                      <span className="text-xs w-24 truncate">{a.name}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">{percentage.toFixed(0)}%</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-muted-foreground">No alpha sources configured</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVipUltra = () => (
    <div className="space-y-6">
      {/* AI Preference Tuner */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sliders className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold">AI Preference Tuner</span>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Risk Appetite</span>
              <span className="text-primary">Balanced</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-muted rounded-full">
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-lg" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Exposure Limit</span>
              <span className="text-primary">60%</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-primary/30 rounded-full" style={{ width: "60%" }}>
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-lg" style={{ left: "58%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Manual Override */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-warning" />
            <span className="text-sm">Manual Override Options</span>
            <span className="ml-auto text-xs text-muted-foreground">(View Only)</span>
          </div>
          <div className="space-y-2">
            {["Pause All Trading", "Force Close All", "Blacklist Instrument", "Whitelist Only Mode"].map((opt, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30">
                <span className="text-xs">{opt}</span>
                <Eye className="w-3 h-3 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* DCN Per Trade */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-3">Full DCN Pipeline Access</div>
          <div className="space-y-2">
            {[
              { label: "Decision Layer", status: "7 signals" },
              { label: "Confirmation", status: "5/6 passed" },
              { label: "Navigation", status: "Active" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-xs p-2 rounded bg-card border border-border">
                <span>{item.label}</span>
                <span className="text-primary">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Venues */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-3">Execution Venue Details</div>
          <div className="space-y-2">
            {[
              { venue: "Prime Broker A", fill: "98.2%" },
              { venue: "Dark Pool", fill: "1.5%" },
              { venue: "Direct Exchange", fill: "0.3%" },
            ].map((v, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span>{v.venue}</span>
                <span className="text-primary">{v.fill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Impact */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-3">Market Impact Report</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Avg Slippage</span>
              <span className="text-primary">0.02 pips</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Fill Rate</span>
              <span className="text-primary">99.8%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Price Impact</span>
              <span className="text-primary">Negligible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state only on initial load, not on refetch
  if (isLoading && !accountRoomsData) {
    return (
      <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading account data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          config.color === "warning" ? "bg-warning/20" : "bg-primary/20"
        )}>
          <config.icon className={cn(
            "w-7 h-7",
            config.color === "warning" ? "text-warning" : "text-primary"
          )} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-2xl font-bold">{config.title}</h3>
            {isFetching && !isLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" title="Updating data..." />
            )}
          </div>
          <p className="text-muted-foreground">{config.subtitle}</p>
        </div>
      </div>

      {type === "retail-small" && renderRetailSmall()}
      {type === "pro-retail" && renderProRetail()}
      {type === "investor" && renderInvestor()}
      {type === "vip-ultra" && renderVipUltra()}
    </div>
  );
}
