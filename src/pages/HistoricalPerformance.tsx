import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import {
  YearlyPerformanceChart,
  EquityCurve,
  DrawdownPanel,
  RiskMetricsCards,
  StrategyContributionTable,
} from "@/components/ui/PerformanceCharts";
import { TrendingUp, Loader2, Database } from "lucide-react";
import { adminApi } from "@/lib/api";

export default function HistoricalPerformance() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["performance-data"], // Same query key as admin panel for cache sharing
    queryFn: async () => {
      // Fetch data from backend - API is the only data source
      const backendData = await adminApi.getPerformance();
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

  // Show error state if API fails
  if (error || !data) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Failed to load Performance data from backend
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
  const performanceData = data;

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
          <div className="inline-flex items-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Algofi <span className="text-primary text-glow">Performance Track Record</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verified institutional-grade performance metrics
          </p>
        </div>

        {/* Risk Metrics */}
        <RiskMetricsCards riskMetrics={performanceData.riskMetrics} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <YearlyPerformanceChart yearlyPerformance={performanceData.yearlyPerformance} />
          <DrawdownPanel drawdownData={performanceData.drawdownData} />
        </div>

        {/* Equity Curve */}
        <EquityCurve equityCurve={performanceData.equityCurve} />

        {/* Strategy Contribution */}
        <StrategyContributionTable strategyContributions={performanceData.strategyContributions} />
      </div>
    </Layout>
  );
}
