import { Layout } from "@/components/layout/Layout";
import {
  SegregatedAccountDiagram,
  MoneyFlowDiagram,
  ProtectionFeatureCards,
} from "@/components/ui/ClientProtection";
import { Shield } from "lucide-react";

export default function ClientProtectionPage() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              How Client Funds Are <span className="text-primary text-glow">Protected</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Institutional-grade security for your capital
          </p>
        </div>

        {/* Protection Features */}
        <ProtectionFeatureCards />

        {/* Diagrams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SegregatedAccountDiagram />
          <MoneyFlowDiagram />
        </div>
      </div>
    </Layout>
  );
}
