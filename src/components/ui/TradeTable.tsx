import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

export interface Trade {
  id: string;
  time: string;
  instrument: string;
  strategy?: string;
  direction: "buy" | "sell";
  entry: number;
  exit?: number;
  size: string;
  pnl?: number;
  rMultiple?: number;
  status?: string;
}

interface TradeTableProps {
  trades: Trade[];
  showStrategy?: boolean;
  showStatus?: boolean;
  compact?: boolean;
}

export function TradeTable({
  trades,
  showStrategy = true,
  showStatus = false,
  compact = false,
}: TradeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Time
            </th>
            <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Instrument
            </th>
            {showStrategy && (
              <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Strategy
              </th>
            )}
            <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Dir
            </th>
            <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Entry
            </th>
            {!compact && (
              <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Exit
              </th>
            )}
            <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Size
            </th>
            {!compact && (
              <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                P&L
              </th>
            )}
            {showStatus && (
              <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr
              key={trade.id}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <td className="py-3 px-2 text-sm font-mono text-muted-foreground">
                {trade.time}
              </td>
              <td className="py-3 px-2 text-sm font-medium">{trade.instrument}</td>
              {showStrategy && (
                <td className="py-3 px-2 text-sm text-muted-foreground">
                  {trade.strategy}
                </td>
              )}
              <td className="py-3 px-2">
                <span
                  className={cn(
                    "text-xs font-bold uppercase",
                    trade.direction === "buy" ? "text-bullish" : "text-bearish"
                  )}
                >
                  {trade.direction}
                </span>
              </td>
              <td className="py-3 px-2 text-sm font-mono">{trade.entry.toFixed(2)}</td>
              {!compact && (
                <td className="py-3 px-2 text-sm font-mono">
                  {trade.exit?.toFixed(2) || "-"}
                </td>
              )}
              <td className="py-3 px-2 text-sm font-mono">{trade.size}</td>
              {!compact && (
                <td className="py-3 px-2">
                  {trade.pnl !== undefined && (
                    <span
                      className={cn(
                        "text-sm font-mono font-medium",
                        trade.pnl >= 0 ? "text-bullish" : "text-bearish"
                      )}
                    >
                      {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                      {trade.rMultiple !== undefined && (
                        <span className="text-muted-foreground ml-1">
                          ({trade.rMultiple >= 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R)
                        </span>
                      )}
                    </span>
                  )}
                </td>
              )}
              {showStatus && trade.status && (
                <td className="py-3 px-2">
                  <StatusBadge text={trade.status} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
