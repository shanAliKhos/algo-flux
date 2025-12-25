import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccountTypeRoom } from "@/components/ui/AccountTypeRoom";
import { Users } from "lucide-react";

export default function AccountRooms() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Account <span className="text-primary text-glow">Intelligence Rooms</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tailored views for every account type.
          </p>
        </div>

        <GlassCard className="p-6"><AccountTypeRoom type="retail-small" /></GlassCard>
        <GlassCard className="p-6"><AccountTypeRoom type="pro-retail" /></GlassCard>
        <GlassCard className="p-6"><AccountTypeRoom type="investor" /></GlassCard>
        <GlassCard className="p-6"><AccountTypeRoom type="vip-ultra" /></GlassCard>
      </div>
    </Layout>
  );
}