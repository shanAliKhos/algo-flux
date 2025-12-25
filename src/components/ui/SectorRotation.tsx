import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

interface RotationItem {
  name: string;
  flow: number; // -100 to 100 (negative = outflow, positive = inflow)
  change24h: number;
}

interface SectorRotationProps {
  className?: string;
  stockSectors?: Array<{
    sector: string;
    momentum: number;
    change24h: number;
  }>;
  cryptoSectors?: Array<{
    sector: string;
    momentum: number;
    change24h: number;
  }>;
  capRotation?: Array<{
    sector: string;
    momentum: number;
    change24h: number;
  }>;
}

export function SectorRotation({ className, stockSectors: propStockSectors, cryptoSectors: propCryptoSectors, capRotation: propCapRotation }: SectorRotationProps) {
  // Convert momentum (0-100) to flow (-100 to 100) by centering around 50
  const momentumToFlow = (momentum: number): number => {
    return (momentum - 50) * 2; // Maps 0->-100, 50->0, 100->100
  };

  // Use backend data if provided, otherwise use defaults
  const stockSectors: RotationItem[] = propStockSectors && propStockSectors.length > 0
    ? propStockSectors.map((item) => ({
        name: item.sector,
        flow: momentumToFlow(item.momentum),
        change24h: item.change24h,
      }))
    : [
        { name: "Technology", flow: 45, change24h: 2.3 },
        { name: "Financials", flow: -22, change24h: -0.8 },
        { name: "Energy", flow: 18, change24h: 1.2 },
        { name: "Healthcare", flow: -8, change24h: -0.3 },
        { name: "Consumer", flow: 12, change24h: 0.6 },
      ];

  const cryptoSectors: RotationItem[] = propCryptoSectors && propCryptoSectors.length > 0
    ? propCryptoSectors.map((item) => ({
        name: item.sector,
        flow: momentumToFlow(item.momentum),
        change24h: item.change24h,
      }))
    : [
        { name: "Layer 1", flow: 35, change24h: 4.2 },
        { name: "Layer 2", flow: 52, change24h: 6.8 },
        { name: "DeFi", flow: -15, change24h: -1.2 },
        { name: "Meme", flow: -45, change24h: -8.5 },
        { name: "AI Tokens", flow: 28, change24h: 3.1 },
      ];

  const capRotation: RotationItem[] = propCapRotation && propCapRotation.length > 0
    ? propCapRotation.map((item) => ({
        name: item.sector,
        flow: momentumToFlow(item.momentum),
        change24h: item.change24h,
      }))
    : [
        { name: "Large Cap", flow: 22, change24h: 1.1 },
        { name: "Mid Cap", flow: 38, change24h: 2.4 },
        { name: "Small Cap", flow: -18, change24h: -1.8 },
      ];

  const renderFlowIndicator = (flow: number) => {
    if (flow > 10) return <ArrowUpRight className="w-4 h-4 text-primary" />;
    if (flow < -10) return <ArrowDownRight className="w-4 h-4 text-destructive" />;
    return <ArrowRight className="w-4 h-4 text-warning" />;
  };

  const renderFlowBar = (flow: number) => {
    const absFlow = Math.abs(flow);
    const isPositive = flow > 0;
    
    return (
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden w-24">
        {isPositive ? (
          <div 
            className="absolute left-1/2 h-full bg-primary rounded-full transition-all"
            style={{ width: `${absFlow / 2}%` }}
          />
        ) : (
          <div 
            className="absolute right-1/2 h-full bg-destructive rounded-full transition-all"
            style={{ width: `${absFlow / 2}%` }}
          />
        )}
        <div className="absolute left-1/2 top-0 w-px h-full bg-muted-foreground/50" />
      </div>
    );
  };

  const SectorCard = ({ title, items }: { title: string; items: RotationItem[] }) => (
    <div className="glass rounded-xl p-4">
      <h4 className="font-display font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
        {title}
      </h4>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {renderFlowIndicator(item.flow)}
              <span className="text-sm truncate">{item.name}</span>
            </div>
            {renderFlowBar(item.flow)}
            <div className={cn(
              "text-xs font-mono w-14 text-right",
              item.change24h > 0 ? "text-primary" : 
              item.change24h < 0 ? "text-destructive" : "text-muted-foreground"
            )}>
              {item.change24h > 0 ? "+" : ""}{item.change24h}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("grid md:grid-cols-3 gap-4", className)}>
      <SectorCard title="Stock Sectors" items={stockSectors} />
      <SectorCard title="Crypto Sectors" items={cryptoSectors} />
      <SectorCard title="Market Cap Rotation" items={capRotation} />
    </div>
  );
}
