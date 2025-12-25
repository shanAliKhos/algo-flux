import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeuralSphere } from "@/components/ui/NeuralSphere";
import { DataStream } from "@/components/ui/DataStream";
import { SentimentBar } from "@/components/ui/SentimentBar";
import { StrategyCard } from "@/components/ui/StrategyCard";
import { TickerTape } from "@/components/ui/TickerTape";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Loader2, Activity, Zap, Globe, Database } from "lucide-react";
import {
  Target,
  BarChart3,
  TrendingUp,
  LineChart,
  Cpu,
  PieChart,
} from "lucide-react";
import { adminApi } from "@/lib/api";

const iconMap: Record<string, any> = {
  Target,
  BarChart3,
  TrendingUp,
  LineChart,
  Cpu,
  PieChart,
};

export default function AIBrain() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["ai-brain-data"], // Same query key as admin panel for cache sharing
    queryFn: async () => {
      // Fetch data from backend - API is the only data source
      const backendData = await adminApi.getAIBrain();
      return backendData;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep data fresh
    refetchOnWindowFocus: true, // Refetch when window regains focus to get latest updates
    retry: 2,
    staleTime: 5000, // Consider data fresh for 5 seconds (reduced for faster updates)
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

  // Show error state if API fails
  if (error || !data) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Failed to load AI Brain data from backend
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

  // Only render when we have data from API
  const aiBrainData = data;

  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
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
          <h1 className="font-display text-4xl lg:text-6xl font-bold mb-4">
            Inside the Mind of <span className="text-primary text-glow">Algofi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where multi-asset market data becomes institutional-grade decisions.
          </p>
        </div>

        {/* Neural Sphere & Data Flows */}
        <div className="grid lg:grid-cols-2 gap-8">
          <GlassCard glow className="relative overflow-hidden">
            <div className="h-[400px]">
              <NeuralSphere />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Neural Processing Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {aiBrainData.neuralConfig.nodes} nodes •{" "}
                {aiBrainData.neuralConfig.connections} connections •{" "}
                {aiBrainData.neuralConfig.latency}ms latency
              </p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-center space-y-6">
            <h3 className="font-display font-bold text-xl mb-2">Live Data Streams</h3>
            {aiBrainData.dataStreams && aiBrainData.dataStreams.length > 0 ? (
              aiBrainData.dataStreams.map((stream, index) => (
                <DataStream
                  key={index}
                  label={stream.label}
                  active={stream.active}
                  delay={stream.delay}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data streams configured</p>
            )}
            <div className="pt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>
                Processing {((aiBrainData.dataPointsPerSecond || 0) / 1000000).toFixed(1)}M data
                points / second
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Global Market Sentiment */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="font-display font-bold text-xl">Global Market Sentiment</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <SentimentBar
              label="Forex"
              bullish={aiBrainData.marketSentiment.forex.bullish}
              neutral={aiBrainData.marketSentiment.forex.neutral}
              bearish={aiBrainData.marketSentiment.forex.bearish}
            />
            <SentimentBar
              label="Crypto"
              bullish={aiBrainData.marketSentiment.crypto.bullish}
              neutral={aiBrainData.marketSentiment.crypto.neutral}
              bearish={aiBrainData.marketSentiment.crypto.bearish}
            />
            <SentimentBar
              label="Equities"
              bullish={aiBrainData.marketSentiment.equities.bullish}
              neutral={aiBrainData.marketSentiment.equities.neutral}
              bearish={aiBrainData.marketSentiment.equities.bearish}
            />
          </div>
        </GlassCard>

        {/* Strategy Dashboard */}
        <div>
          <h3 className="font-display font-bold text-2xl mb-6">
            Strategy Overview Dashboard
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiBrainData.strategies && aiBrainData.strategies.length > 0 ? (
              aiBrainData.strategies.map((strategy) => {
                const IconComponent = iconMap[strategy.icon] || Target;
                return (
                  <StrategyCard
                    key={strategy.name}
                    name={strategy.name}
                    icon={IconComponent}
                    status={strategy.status}
                    accuracy={strategy.accuracy}
                    confidence={strategy.confidence}
                    bias={strategy.bias}
                    instruments={strategy.instruments}
                    path={strategy.path}
                  />
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground col-span-full">
                No strategies configured
              </p>
            )}
          </div>
        </div>

        {/* Live Data Feed */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4">Live Data Feed</h3>
          <TickerTape />
          <div className="mt-4 flex flex-wrap gap-2">
            {aiBrainData.newsTags && aiBrainData.newsTags.length > 0 ? (
              aiBrainData.newsTags.map((tag, i) => (
                <StatusBadge
                  key={i}
                  sentiment={tag.type}
                  text={tag.text}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No news tags available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
