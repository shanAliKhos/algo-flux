import { Layout } from "@/components/layout/Layout";
import {
  GlobalConnectivityMap,
  ExecutionFlowDiagram,
  ConnectivityCards,
  ExecutionQualityPanel,
} from "@/components/ui/BrokerConnectivity";
import { Network } from "lucide-react";

export default function BrokerNetwork() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Network className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Institutional <span className="text-primary text-glow">Execution Network</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Global connectivity with prime brokers and liquidity providers
          </p>
        </div>

        {/* Global Map */}
        <GlobalConnectivityMap />

        {/* Execution Quality */}
        <ExecutionQualityPanel />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExecutionFlowDiagram />
          <div className="space-y-6">
            <ConnectivityCards />
          </div>
        </div>
      </div>
    </Layout>
  );
}
