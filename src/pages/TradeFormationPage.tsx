import { Layout } from "@/components/layout/Layout";
import { TradeFormation } from "@/components/ui/TradeFormation";
import { Sparkles } from "lucide-react";

export default function TradeFormationPage() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              The Birth of a <span className="text-primary text-glow">Trade</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A transparent journey from signal to profit.
          </p>
        </div>
        <TradeFormation />
      </div>
    </Layout>
  );
}