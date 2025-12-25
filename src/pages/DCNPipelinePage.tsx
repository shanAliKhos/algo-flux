import { Layout } from "@/components/layout/Layout";
import { DCNPipeline } from "@/components/ui/DCNPipeline";
import { GitBranch } from "lucide-react";

export default function DCNPipelinePage() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <GitBranch className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Algofi <span className="text-primary text-glow">DCN Pipeline</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From raw data → validated decision → market execution.
          </p>
        </div>
        <DCNPipeline />
      </div>
    </Layout>
  );
}