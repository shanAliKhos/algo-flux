import { cn } from "@/lib/utils";

type Status = "active" | "waiting" | "cooling" | "watching" | "preparing" | "in-trade";
type Sentiment = "bullish" | "bearish" | "neutral";
type Risk = "low" | "medium" | "high";

interface StatusBadgeProps {
  status?: Status;
  sentiment?: Sentiment;
  risk?: Risk;
  text?: string;
}

export function StatusBadge({ status, sentiment, risk, text }: StatusBadgeProps) {
  const getStyles = () => {
    if (status) {
      switch (status) {
        case "active":
        case "in-trade":
          return "bg-primary/20 text-primary border-primary/30";
        case "waiting":
        case "watching":
          return "bg-neutral/20 text-neutral border-neutral/30";
        case "cooling":
        case "preparing":
          return "bg-muted text-muted-foreground border-border";
      }
    }
    if (sentiment) {
      switch (sentiment) {
        case "bullish":
          return "bg-bullish/20 text-bullish border-bullish/30";
        case "bearish":
          return "bg-bearish/20 text-bearish border-bearish/30";
        case "neutral":
          return "bg-neutral/20 text-neutral border-neutral/30";
      }
    }
    if (risk) {
      switch (risk) {
        case "low":
          return "bg-primary/20 text-primary border-primary/30";
        case "medium":
          return "bg-neutral/20 text-neutral border-neutral/30";
        case "high":
          return "bg-bearish/20 text-bearish border-bearish/30";
      }
    }
    return "bg-muted text-muted-foreground border-border";
  };

  const getLabel = () => {
    if (text) return text;
    if (status) return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
    if (sentiment) return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
    if (risk) return risk.charAt(0).toUpperCase() + risk.slice(1);
    return "";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        getStyles()
      )}
    >
      {getLabel()}
    </span>
  );
}
