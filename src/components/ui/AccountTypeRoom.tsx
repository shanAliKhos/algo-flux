import { cn } from "@/lib/utils";
import { 
  Shield, TrendingUp, BarChart3, Activity, AlertTriangle,
  CheckCircle2, Sliders, Download, FileText, Terminal,
  Gauge, Target, PieChart, Zap, Settings, Eye
} from "lucide-react";

type AccountType = "retail-small" | "pro-retail" | "investor" | "vip-ultra";

interface AccountTypeRoomProps {
  type: AccountType;
  className?: string;
}

export function AccountTypeRoom({ type, className }: AccountTypeRoomProps) {
  const configs = {
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

  const config = configs[type];

  const renderRetailSmall = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Safe Mode */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Safe Mode</span>
          <span className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-4 h-4" />
            Active
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          All trades filtered through maximum safety protocols
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
            <div className="h-full bg-primary rounded-full" style={{ width: "35%" }} />
          </div>
          <span className="text-sm font-mono">35%</span>
        </div>
      </div>

      {/* Simple Signals */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">Recent Signals</div>
        <div className="space-y-2">
          {[
            { emoji: "✅", text: "XAUUSD buy closed +$45" },
            { emoji: "⏳", text: "BTCUSDT watching..." },
            { emoji: "🛡️", text: "Risk limit: OK" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{item.emoji}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why Safe */}
      <div className="glass rounded-xl p-4 md:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm">Why This Trade Was Safe</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Low volatility environment</li>
          <li>• Strong trend confirmation</li>
          <li>• Risk only 0.5% of account</li>
          <li>• Clear stop loss defined</li>
        </ul>
      </div>

      {/* Max DD Protection */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-2">Max Drawdown Protection</div>
        <div className="text-2xl font-bold text-primary">-5% max</div>
        <div className="text-xs text-muted-foreground mt-1">Currently at -1.2%</div>
      </div>

      {/* Low Leverage */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-2">Leverage Mode</div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Low: 1:10</span>
          <span className="text-xs text-muted-foreground">Protected</span>
        </div>
      </div>
    </div>
  );

  const renderProRetail = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Strategy Utilization */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">Strategy Utilization</div>
        <div className="space-y-2">
          {[
            { name: "Nuvex", pct: 35 },
            { name: "Drav", pct: 28 },
            { name: "Tenzor", pct: 22 },
            { name: "Others", pct: 15 },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs w-16">{s.name}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${s.pct}%` }} />
              </div>
              <span className="text-xs font-mono w-8">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Quality */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm">Execution Quality</span>
        </div>
        <div className="text-3xl font-bold text-warning">94.2</div>
        <div className="text-xs text-muted-foreground">Out of 100 • Excellent</div>
      </div>

      {/* Market Regime */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">Market Regime</div>
        <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <div className="text-primary font-medium">Trending + Risk-On</div>
          <div className="text-xs text-muted-foreground mt-1">Favoring momentum strategies</div>
        </div>
      </div>

      {/* Opportunity Heatmap */}
      <div className="glass rounded-xl p-4 md:col-span-2">
        <div className="text-sm text-muted-foreground mb-3">Opportunity Heatmap</div>
        <div className="grid grid-cols-4 gap-2">
          {["XAUUSD", "BTCUSDT", "NAS100", "EURUSD", "TSLA", "AAPL", "ETH", "GBPJPY"].map((sym, i) => (
            <div 
              key={i}
              className={cn(
                "p-2 rounded text-center text-xs",
                i < 3 ? "bg-primary/30 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {sym}
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Confidence */}
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">Strategy Confidence</div>
        <div className="space-y-1">
          {[
            { name: "Drav", conf: "High" },
            { name: "Tenzor", conf: "High" },
            { name: "Nuvex", conf: "Medium" },
          ].map((s, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span>{s.name}</span>
              <span className={s.conf === "High" ? "text-primary" : "text-warning"}>{s.conf}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInvestor = () => (
    <div className="space-y-6">
      {/* Equity Curve */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Multi-Month Equity Curve</div>
            <div className="text-2xl font-bold text-primary">+24.7% YTD</div>
          </div>
          <div className="flex gap-2">
            {["1M", "3M", "6M", "YTD"].map((p, i) => (
              <button 
                key={i}
                className={cn(
                  "px-3 py-1 rounded text-xs",
                  i === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-32 bg-card rounded-lg border border-border flex items-end p-2">
          {[45, 52, 48, 58, 55, 62, 68, 65, 72, 78, 75, 82].map((h, i) => (
            <div key={i} className="flex-1 mx-0.5">
              <div 
                className="bg-primary/60 rounded-t"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* DD Zones */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-3">Drawdown Zones</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Max DD</span>
              <span className="text-destructive">-8.4%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Current DD</span>
              <span className="text-warning">-2.1%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Avg Recovery</span>
              <span className="text-primary">12 days</span>
            </div>
          </div>
        </div>

        {/* Vol-Adjusted Returns */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-3">Risk-Adjusted Metrics</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Sharpe Ratio</span>
              <span className="text-primary">1.82</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Sortino Ratio</span>
              <span className="text-primary">2.14</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Calmar Ratio</span>
              <span className="text-primary">2.94</span>
            </div>
          </div>
        </div>

        {/* Alpha Sources */}
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-3">Alpha Sources</div>
          <div className="space-y-2">
            {[
              { name: "Momentum", pct: 38 },
              { name: "Mean Reversion", pct: 28 },
              { name: "SMC/Liquidity", pct: 22 },
              { name: "Statistical Arb", pct: 12 },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-24">{a.name}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          Export Monthly Report
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
          <FileText className="w-4 h-4" />
          View Trade Book
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
          <Terminal className="w-4 h-4" />
          View System Logs
        </button>
      </div>
    </div>
  );

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
        <div>
          <h3 className="font-display text-2xl font-bold">{config.title}</h3>
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
