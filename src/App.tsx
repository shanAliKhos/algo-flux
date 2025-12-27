import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { PublicRoute } from "./components/admin/PublicRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

import AIBrain from "./pages/AIBrain";
import MarketRadar from "./pages/MarketRadar";
import Execution from "./pages/Execution";
import TradeReplay from "./pages/TradeReplay";
import DecisionPipeline from "./pages/DecisionPipeline";
import StrategySuite from "./pages/StrategySuite";
import Nuvex from "./pages/strategy/Nuvex";
import Xylo from "./pages/strategy/Xylo";
import Drav from "./pages/strategy/Drav";
import Yark from "./pages/strategy/Yark";
import Tenzor from "./pages/strategy/Tenzor";
import Omnix from "./pages/strategy/Omnix";
import Portfolio from "./pages/Portfolio";
import Transparency from "./pages/Transparency";
import NotFound from "./pages/NotFound";
import AlgoBrain from "./pages/AlgoBrain";
import DCNPipelinePage from "./pages/DCNPipelinePage";
import TradeFormationPage from "./pages/TradeFormationPage";
import AccountRooms from "./pages/AccountRooms";
import TradeLibrary from "./pages/TradeLibrary";
import MarketConditions from "./pages/MarketConditions";
import AuditRoom from "./pages/AuditRoom";
import HistoricalPerformance from "./pages/HistoricalPerformance";
import BrokerNetwork from "./pages/BrokerNetwork";
import ClientProtectionPage from "./pages/ClientProtectionPage";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import NeuralProcessing from "./pages/admin/NeuralProcessing";
import MarketBrain from "./pages/admin/MarketBrain";
import DataStreams from "./pages/admin/DataStreams";
import Strategies from "./pages/admin/Strategies";
import Performance from "./pages/admin/Performance";
import PortfolioAdmin from "./pages/admin/Portfolio";
import TradeFormationAdmin from "./pages/admin/TradeFormation";
import AccountRoomsAdmin from "./pages/admin/AccountRooms";
import AuditAdmin from "./pages/admin/Audit";
import RadarAdmin from "./pages/admin/Radar";
import ConditionsAdmin from "./pages/admin/Conditions";
import TransparencyAdmin from "./pages/admin/Transparency";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes - No authentication required */}
            {/* These routes are accessible to everyone without login */}
            <Route path="/" element={<AIBrain />} />
            <Route path="/radar" element={<MarketRadar />} />
            <Route path="/execution" element={<Execution />} />
            <Route path="/replay" element={<TradeReplay />} />
            <Route path="/pipeline" element={<DecisionPipeline />} />
            <Route path="/strategies" element={<StrategySuite />} />
            <Route path="/strategy/nuvex" element={<Nuvex />} />
            <Route path="/strategy/xylo" element={<Xylo />} />
            <Route path="/strategy/drav" element={<Drav />} />
            <Route path="/strategy/yark" element={<Yark />} />
            <Route path="/strategy/tenzor" element={<Tenzor />} />
            <Route path="/strategy/omnix" element={<Omnix />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/algobrain" element={<AlgoBrain />} />
            <Route path="/dcn" element={<DCNPipelinePage />} />
            <Route path="/trade-formation" element={<TradeFormationPage />} />
            <Route path="/accounts" element={<AccountRooms />} />
            <Route path="/library" element={<TradeLibrary />} />
            <Route path="/conditions" element={<MarketConditions />} />
            <Route path="/audit" element={<AuditRoom />} />
            <Route path="/performance" element={<HistoricalPerformance />} />
            <Route path="/broker-network" element={<BrokerNetwork />} />
            <Route path="/client-protection" element={<ClientProtectionPage />} />
            
            {/* Admin Routes - Authentication required */}
            {/* These routes require login and are protected */}
            <Route
              path="/admin/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/neural-processing"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <NeuralProcessing />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/market-brain"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <MarketBrain />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-streams"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <DataStreams />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/strategies"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Strategies />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/portfolio"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PortfolioAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/performance"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Performance />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/trade-formation"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <TradeFormationAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/account-rooms"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AccountRoomsAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-room"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AuditAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/market-radar"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <RadarAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/conditions"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ConditionsAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transparency"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <TransparencyAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
