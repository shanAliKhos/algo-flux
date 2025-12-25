import { Layout } from "@/components/layout/Layout";
import { TransparencyAudit } from "@/components/ui/TransparencyAudit";
import { Shield } from "lucide-react";

export default function AuditRoom() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Transparency <span className="text-primary text-glow">Audit Room</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete transparency. Institutional standards.
          </p>
        </div>
        <TransparencyAudit />
      </div>
    </Layout>
  );
}