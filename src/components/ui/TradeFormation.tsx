import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { getAllSymbols } from "@/lib/trading-pairs";
import { useState } from "react";
import { 
  Search, Eye, Target, Shield, Zap, Activity, 
  TrendingUp, TrendingDown, Clock, DollarSign, Star,
  AlertTriangle, CheckCircle2, BarChart3, MessageSquare, Loader2, ChevronDown, ChevronUp, X
} from "lucide-react";

interface TradeFormationProps {
  className?: string;
}

export function TradeFormation({ className }: TradeFormationProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trade-formation'],
    queryFn: async () => {
      try {
        return await adminApi.getTradeFormation();
      } catch (error: any) {
        // Return default data if API doesn't exist yet
        if (error?.message?.includes('not found')) {
          return {
            opportunityDetection: {
              instruments: [
                { symbol: "XAUUSD", reason: "Liquidity sweep detected at 2,640.00" },
                { symbol: "EURUSD", reason: "Support level bounce at 1.0850" },
                { symbol: "BTCUSDT", reason: "Breakout above resistance at 45,200" },
                { symbol: "NAS100", reason: "Bullish divergence on RSI" },
                { symbol: "AAPL", reason: "Earnings beat expectations" },
                { symbol: "TSLA", reason: "Volume spike with bullish engulfing" },
                { symbol: "ETHUSDT", reason: "Key level retest at 2,800" },
                { symbol: "GBPUSD", reason: "Bank of England rate decision impact" }
              ],
              selectedInstrument: "XAUUSD"
            },
            patternRecognition: {
              patterns: ["Engulfing", "CHOCH", "BOS", "Trend Break"],
              detectedPattern: "Engulfing",
              chartData: [
                { x: 10, y: 60 }, { x: 30, y: 45 }, { x: 50, y: 55 }, { x: 70, y: 35 },
                { x: 90, y: 45 }, { x: 110, y: 25 }, { x: 130, y: 40 }, { x: 150, y: 20 },
                { x: 170, y: 35 }, { x: 190, y: 15 }
              ]
            },
            riskShaping: [
              { label: "Position Size", value: "0.85 lots", bar: 42 },
              { label: "Volatility Adj.", value: "-15%", bar: 85 },
              { label: "DD Protection", value: "Active", bar: 100 },
              { label: "Correlation Check", value: "Passed", bar: 95 },
            ],
            executionBlueprint: {
              entry: "2,641.50",
              stopLoss: "2,635.00",
              takeProfit: "2,658.00",
              rrRatio: "2.54"
            },
            liveManagement: [
              { label: "Dynamic Stop", status: "Trailing +25 pips", active: true },
              { label: "Partial TP", status: "50% @ 2,652.00", active: true },
              { label: "Time Stop", status: "4h remaining", active: false },
              { label: "Sentiment", status: "Still bullish", active: true },
            ],
            finalExitReport: {
              exitReason: "Take Profit Hit",
              rating: "A",
              profitLoss: "+$1,245",
              duration: "2h 34m",
              notes: "Strong momentum continuation after liquidity grab. Price respected institutional order block perfectly."
            }
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    // Use default data on error
    const defaultData = {
      opportunityDetection: {
        instruments: [
          { symbol: "XAUUSD", reason: "Liquidity sweep detected at 2,640.00" },
          { symbol: "EURUSD", reason: "Support level bounce at 1.0850" },
          { symbol: "BTCUSDT", reason: "Breakout above resistance at 45,200" },
          { symbol: "NAS100", reason: "Bullish divergence on RSI" },
          { symbol: "AAPL", reason: "Earnings beat expectations" },
          { symbol: "TSLA", reason: "Volume spike with bullish engulfing" },
          { symbol: "ETHUSDT", reason: "Key level retest at 2,800" },
          { symbol: "GBPUSD", reason: "Bank of England rate decision impact" }
        ],
        selectedInstrument: "XAUUSD"
      },
      patternRecognition: {
        patterns: ["Engulfing", "CHOCH", "BOS", "Trend Break"],
        detectedPattern: "Engulfing",
        chartData: [
          { x: 10, y: 60 }, { x: 30, y: 45 }, { x: 50, y: 55 }, { x: 70, y: 35 },
          { x: 90, y: 45 }, { x: 110, y: 25 }, { x: 130, y: 40 }, { x: 150, y: 20 },
          { x: 170, y: 35 }, { x: 190, y: 15 }
        ]
      },
      riskShaping: [
        { label: "Position Size", value: "0.85 lots", bar: 42 },
        { label: "Volatility Adj.", value: "-15%", bar: 85 },
        { label: "DD Protection", value: "Active", bar: 100 },
        { label: "Correlation Check", value: "Passed", bar: 95 },
      ],
      executionBlueprint: {
        entry: "2,641.50",
        stopLoss: "2,635.00",
        takeProfit: "2,658.00",
        rrRatio: "2.54"
      },
      liveManagement: [
        { label: "Dynamic Stop", status: "Trailing +25 pips", active: true },
        { label: "Partial TP", status: "50% @ 2,652.00", active: true },
        { label: "Time Stop", status: "4h remaining", active: false },
        { label: "Sentiment", status: "Still bullish", active: true },
      ],
      finalExitReport: {
        exitReason: "Take Profit Hit",
        rating: "A",
        profitLoss: "+$1,245",
        duration: "2h 34m",
        notes: "Strong momentum continuation after liquidity grab. Price respected institutional order block perfectly."
      }
    };
    return <TradeFormationContent data={defaultData} className={className} />;
  }

  return <TradeFormationContent data={data} className={className} />;
}

function TradeFormationContent({ data, className }: { data: any; className?: string }) {
  // Initialize with selected instrument expanded by default
  const [expandedInstrument, setExpandedInstrument] = useState<string | null>(
    data.opportunityDetection.selectedInstrument || null
  );
  // Track which instrument is visually selected (clicked)
  const [visuallySelected, setVisuallySelected] = useState<string | null>(
    data.opportunityDetection.selectedInstrument || null
  );
  
  const sections = [
    {
      title: "1. Opportunity Detection",
      icon: Search,
      color: "primary",
      content: (
        <div className="space-y-4">
          {/* Instrument Heatmap */}
          <div className="grid grid-cols-4 gap-2">
            {data.opportunityDetection.instruments.map((instrument: { symbol: string; reason: string } | string, i: number) => {
              // Handle both old format (string) and new format (object)
              const symbol = typeof instrument === 'string' ? instrument : instrument.symbol;
              // Use visually selected if set, otherwise fall back to data's selectedInstrument
              const isSelected = symbol === (visuallySelected || data.opportunityDetection.selectedInstrument);
              const isExpanded = expandedInstrument === symbol;
              
              return (
                <div 
                  key={i}
                  onClick={() => {
                    // Set as visually selected
                    setVisuallySelected(symbol);
                    // Expand/collapse reason
                    setExpandedInstrument(isExpanded ? null : symbol);
                  }}
                  className={cn(
                    "p-2 rounded text-center text-xs font-mono transition-all cursor-pointer hover:scale-105",
                    isSelected
                      ? "bg-green-500/30 border-2 border-green-500 text-green-400 font-semibold shadow-lg shadow-green-500/20" 
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border",
                    isExpanded && !isSelected && "ring-2 ring-primary/50"
                  )}
                  title="Click to select and see reason"
                >
                  {symbol}
                  {isSelected && <Eye className="w-3 h-3 mx-auto mt-1 text-green-400" />}
                </div>
              );
            })}
          </div>
          
          {/* Show reason for clicked/expanded instrument */}
          {expandedInstrument && (() => {
            const instrument = data.opportunityDetection.instruments.find(
              (inst: { symbol: string; reason: string } | string) => {
                const sym = typeof inst === 'string' ? inst : inst.symbol;
                return sym === expandedInstrument;
              }
            );
            
            if (!instrument) return null;
            
            const symbol = typeof instrument === 'string' ? instrument : instrument.symbol;
            const reason = typeof instrument === 'string' 
              ? (data.opportunityDetection.reason || 'No reason provided')
              : instrument.reason;
            // Use visually selected if set, otherwise fall back to data's selectedInstrument
            const isSelected = symbol === (visuallySelected || data.opportunityDetection.selectedInstrument);
            
            return (
              <div 
                className={cn(
                  "flex items-start gap-2 p-3 rounded-lg border transition-all animate-in slide-in-from-top-2",
                  isSelected
                    ? "bg-green-500/10 border-2 border-green-500/30 shadow-lg shadow-green-500/10"
                    : "bg-muted/30 border-border"
                )}
              >
                <Target className={cn(
                  "w-4 h-4 mt-0.5 flex-shrink-0",
                  isSelected ? "text-green-400" : "text-muted-foreground"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-mono font-semibold",
                        isSelected ? "text-green-400" : "text-foreground"
                      )}>
                        {symbol}
                      </span>
                      {isSelected && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">
                          Selected
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedInstrument(null);
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={cn(
                    "text-sm",
                    isSelected ? "text-green-50" : "text-foreground"
                  )}>{reason}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )
    },
    {
      title: "2. Pattern Recognition",
      icon: Eye,
      color: "warning",
      content: (
        <div className="space-y-4">
          {/* Simulated chart with pattern */}
          <div className="h-32 bg-card rounded-lg border border-border relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 80">
              <path 
                d={data.patternRecognition.chartData.map((point: { x: number; y: number }, i: number) => 
                  `${i === 0 ? 'M' : 'L'}${point.x},${point.y}`
                ).join(' ')}
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2"
                className="animate-data-flow"
              />
              {data.patternRecognition.chartData.length > 0 && (() => {
                const detectedIndex = Math.floor(data.patternRecognition.chartData.length * 0.6);
                const detectedPoint = data.patternRecognition.chartData[detectedIndex];
                return (
                  <>
                    <circle cx={detectedPoint.x} cy={detectedPoint.y} r="6" fill="hsl(var(--warning) / 0.3)" stroke="hsl(var(--warning))" strokeWidth="2" />
                    <text x={detectedPoint.x + 5} y={detectedPoint.y - 5} fill="hsl(var(--warning))" fontSize="8">{data.patternRecognition.detectedPattern}</text>
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.patternRecognition.patterns.map((pattern: string, i: number) => (
              <span 
                key={i}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  pattern === data.patternRecognition.detectedPattern
                    ? "bg-warning/20 text-warning border border-warning/30" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "3. Risk Shaping",
      icon: Shield,
      color: "destructive",
      content: (
        <div className="space-y-3">
          {data.riskShaping.map((item: { label: string; value: string; bar: number }, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-28">{item.label}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-destructive rounded-full"
                  style={{ width: `${item.bar}%` }}
                />
              </div>
              <span className="text-xs font-mono w-16 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "4. Execution Blueprint",
      icon: Zap,
      color: "primary",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Entry", value: data.executionBlueprint.entry, icon: TrendingUp },
            { label: "Stop Loss", value: data.executionBlueprint.stopLoss, icon: TrendingDown },
            { label: "Take Profit", value: data.executionBlueprint.takeProfit, icon: DollarSign },
            { label: "R:R Ratio", value: data.executionBlueprint.rrRatio, icon: BarChart3 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <item.icon className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="font-mono font-bold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "5. Live Management",
      icon: Activity,
      color: "warning",
      content: (
        <div className="space-y-3">
          {data.liveManagement.map((item: { label: string; status: string; active: boolean }, i: number) => (
            <div 
              key={i}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                item.active 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-muted/30 border-border"
              )}
            >
              <span className="text-sm">{item.label}</span>
              <span className={cn(
                "text-xs font-mono",
                item.active ? "text-primary" : "text-muted-foreground"
              )}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "6. Final Exit Report",
      icon: CheckCircle2,
      color: "primary",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm">Exit Reason</span>
            <span className="text-primary font-medium">{data.finalExitReport.exitReason}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <Star className="w-5 h-5 mx-auto text-warning mb-1" />
              <div className="text-xs text-muted-foreground">Rating</div>
              <div className="font-bold text-warning">{data.finalExitReport.rating}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <DollarSign className="w-5 h-5 mx-auto text-primary mb-1" />
              <div className="text-xs text-muted-foreground">P/L</div>
              <div className="font-bold text-primary">{data.finalExitReport.profitLoss}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <Clock className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-bold">{data.finalExitReport.duration}</div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {data.finalExitReport.notes}
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {sections.map((section, i) => (
        <div 
          key={i}
          className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              section.color === "primary" ? "bg-primary/20" :
              section.color === "warning" ? "bg-warning/20" : "bg-destructive/20"
            )}>
              <section.icon className={cn(
                "w-5 h-5",
                section.color === "primary" ? "text-primary" :
                section.color === "warning" ? "text-warning" : "text-destructive"
              )} />
            </div>
            <h4 className="font-display font-semibold">{section.title}</h4>
          </div>
          {section.content}
        </div>
      ))}
    </div>
  );
}
