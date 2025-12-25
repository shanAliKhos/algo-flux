import { cn } from "@/lib/utils";

interface SentimentBarProps {
  label: string;
  bullish: number;
  bearish: number;
  neutral: number;
}

export function SentimentBar({ label, bullish, bearish, neutral }: SentimentBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="flex gap-4 text-xs">
          <span className="text-bullish">{bullish}% Bull</span>
          <span className="text-neutral">{neutral}% Neutral</span>
          <span className="text-bearish">{bearish}% Bear</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted flex overflow-hidden">
        <div
          className="bg-bullish transition-all duration-500"
          style={{ width: `${bullish}%` }}
        />
        <div
          className="bg-neutral transition-all duration-500"
          style={{ width: `${neutral}%` }}
        />
        <div
          className="bg-bearish transition-all duration-500"
          style={{ width: `${bearish}%` }}
        />
      </div>
    </div>
  );
}
