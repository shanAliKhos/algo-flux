import { cn } from "@/lib/utils";

interface HeatmapCell {
  label: string;
  value: number;
  sublabel?: string;
}

interface HeatmapGridProps {
  cells: HeatmapCell[];
  columns?: number;
}

function getHeatColor(value: number): string {
  if (value >= 70) return "bg-bullish/30 border-bullish/50 text-bullish";
  if (value >= 40) return "bg-neutral/30 border-neutral/50 text-neutral";
  return "bg-bearish/30 border-bearish/50 text-bearish";
}

export function HeatmapGrid({ cells, columns = 3 }: HeatmapGridProps) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {cells.map((cell) => (
        <div
          key={cell.label}
          className={cn(
            "p-4 rounded-xl border transition-all duration-300 hover:scale-105",
            getHeatColor(cell.value)
          )}
        >
          <div className="text-center">
            <p className="text-2xl font-display font-bold">{cell.value}</p>
            <p className="text-sm font-medium mt-1">{cell.label}</p>
            {cell.sublabel && (
              <p className="text-xs opacity-70 mt-0.5">{cell.sublabel}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
