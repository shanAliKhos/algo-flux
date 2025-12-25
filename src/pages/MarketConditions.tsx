import { Layout } from "@/components/layout/Layout";
import { MarketConditionBoard } from "@/components/ui/MarketConditionBoard";
import { Compass } from "lucide-react";

export default function MarketConditions() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Compass className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Market <span className="text-primary text-glow">Condition Board</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What the market wants right now.
          </p>
        </div>
        <MarketConditionBoard />
      </div>
    </Layout>
  );
}