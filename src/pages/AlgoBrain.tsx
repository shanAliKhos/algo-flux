import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { MarketMoodSphere } from "@/components/ui/MarketMoodSphere";
import { PressureBoard } from "@/components/ui/PressureBoard";
import { SectorRotation } from "@/components/ui/SectorRotation";
import { InstrumentWatchGrid } from "@/components/ui/InstrumentWatchGrid";
import { Brain, Loader2, Database } from "lucide-react";
import { adminApi } from "@/lib/api";

export default function AlgoBrain() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["market-brain-data"],
    queryFn: async () => {
      // Fetch data from backend - API is the only data source
      const backendData = await adminApi.getMarketBrain();
      return backendData;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep data fresh
    refetchOnWindowFocus: true, // Refetch when window regains focus to get latest updates
    retry: 2,
    staleTime: 5000, // Consider data fresh for 5 seconds
  });

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Show error state only if there's a real error (not just missing data)
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Failed to load Market Brain data from backend
            </p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Please check your connection"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Make sure the backend server is running at {import.meta.env.VITE_API_URL || 'http://localhost:3000'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Use data from API or empty structure
  const marketBrainData = data || {
    moodData: {
      forex: 0,
      crypto: 0,
      commodities: 0,
      equities: 0,
      riskOnOff: 0,
      dollarStrength: 0,
      volatility: 'normal' as const,
    },
    pressureItems: [],
    stockSectors: [],
    cryptoSectors: [],
    capRotation: [],
    instruments: [],
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Database className="w-3 h-3 text-primary" />
              <span>Live from backend</span>
              {isFetching && (
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
              )}
            </div>
          </div>
          <div className="inline-flex items-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Algofi <span className="text-primary text-glow">Market Brain</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What the global market is thinking right now.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <GlassCard className="p-8">
            <h3 className="font-display text-xl font-bold mb-6 text-center">Market Mood Engine</h3>
            <MarketMoodSphere data={marketBrainData.moodData} />
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-display text-xl font-bold mb-6">Macro Pressure Board</h3>
            <PressureBoard pressureItems={marketBrainData.pressureItems} />
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h3 className="font-display text-xl font-bold mb-6">Sector Rotations</h3>
          <SectorRotation 
            stockSectors={marketBrainData.stockSectors}
            cryptoSectors={marketBrainData.cryptoSectors}
            capRotation={marketBrainData.capRotation}
          />
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-xl font-bold mb-6">Instrument Watch Grid</h3>
          <InstrumentWatchGrid instruments={marketBrainData.instruments} />
        </GlassCard>
      </div>
    </Layout>
  );
}