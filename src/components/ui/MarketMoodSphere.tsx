import { cn } from "@/lib/utils";

interface MoodData {
  forex: number;
  crypto: number;
  commodities: number;
  equities: number;
  riskOnOff: number; // -100 to 100
  dollarStrength: number; // 0 to 100
  volatility: "calm" | "normal" | "storm";
}

interface MarketMoodSphereProps {
  data: MoodData;
  className?: string;
}

export function MarketMoodSphere({ data, className }: MarketMoodSphereProps) {
  const overallMood = (data.forex + data.crypto + data.commodities + data.equities) / 4;
  
  const getMoodColor = (value: number) => {
    if (value >= 60) return "hsl(var(--bullish))";
    if (value <= 40) return "hsl(var(--bearish))";
    return "hsl(var(--neutral))";
  };

  const getVolatilityInfo = (vol: string) => {
    switch (vol) {
      case "calm": return { color: "text-primary", label: "Calm", icon: "☀️" };
      case "storm": return { color: "text-destructive", label: "Storm", icon: "⛈️" };
      default: return { color: "text-warning", label: "Normal", icon: "🌤️" };
    }
  };

  const volInfo = getVolatilityInfo(data.volatility);

  return (
    <div className={cn("relative", className)}>
      {/* Main Sphere */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Outer glow rings */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse-slow opacity-30"
          style={{ 
            background: `radial-gradient(circle, ${getMoodColor(overallMood)} 0%, transparent 70%)`,
            filter: "blur(30px)"
          }}
        />
        <div 
          className="absolute inset-4 rounded-full animate-pulse-slow opacity-50"
          style={{ 
            background: `radial-gradient(circle, ${getMoodColor(overallMood)} 0%, transparent 60%)`,
            filter: "blur(20px)",
            animationDelay: "0.5s"
          }}
        />
        
        {/* Core sphere */}
        <div 
          className="absolute inset-8 rounded-full border-2 flex items-center justify-center"
          style={{ 
            background: `radial-gradient(circle at 30% 30%, hsl(var(--card)) 0%, hsl(var(--background)) 100%)`,
            borderColor: getMoodColor(overallMood),
            boxShadow: `0 0 60px ${getMoodColor(overallMood)}40, inset 0 0 40px ${getMoodColor(overallMood)}20`
          }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold font-display" style={{ color: getMoodColor(overallMood) }}>
              {Math.round(overallMood)}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Market Mood
            </div>
          </div>
        </div>

        {/* Orbiting indicators */}
        {[
          { label: "FX", value: data.forex, angle: 0 },
          { label: "Crypto", value: data.crypto, angle: 90 },
          { label: "Cmdty", value: data.commodities, angle: 180 },
          { label: "Equity", value: data.equities, angle: 270 },
        ].map((item, i) => {
          const radian = (item.angle * Math.PI) / 180;
          const x = Math.cos(radian) * 100 + 100;
          const y = Math.sin(radian) * 100 + 100;
          
          return (
            <div
              key={i}
              className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full glass flex flex-col items-center justify-center"
              style={{ 
                left: x,
                top: y,
                borderColor: getMoodColor(item.value),
                boxShadow: `0 0 15px ${getMoodColor(item.value)}40`
              }}
            >
              <div className="text-[10px] text-muted-foreground">{item.label}</div>
              <div className="text-xs font-bold" style={{ color: getMoodColor(item.value) }}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom indicators */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {/* Risk On/Off */}
        <div className="glass rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground mb-2">Risk Stance</div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${(data.riskOnOff + 100) / 2}%`,
                background: data.riskOnOff > 0 
                  ? "hsl(var(--bullish))" 
                  : "hsl(var(--bearish))"
              }}
            />
          </div>
          <div className="text-xs mt-1 font-medium">
            {data.riskOnOff > 20 ? "Risk-On" : data.riskOnOff < -20 ? "Risk-Off" : "Neutral"}
          </div>
        </div>

        {/* Dollar Strength */}
        <div className="glass rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground mb-2">USD Strength</div>
          <div className="text-xl font-bold text-primary">{data.dollarStrength}</div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>

        {/* Volatility Weather */}
        <div className="glass rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground mb-2">Volatility</div>
          <div className="text-2xl">{volInfo.icon}</div>
          <div className={cn("text-xs font-medium", volInfo.color)}>{volInfo.label}</div>
        </div>
      </div>
    </div>
  );
}
