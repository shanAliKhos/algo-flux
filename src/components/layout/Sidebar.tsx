import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import {
  Brain,
  Radar,
  Zap,
  PlayCircle,
  GitBranch,
  Layers,
  Target,
  BarChart3,
  TrendingUp,
  LineChart,
  Cpu,
  PieChart,
  Briefcase,
  Shield,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Network,
  Lock,
  LucideIcon,
} from "lucide-react";

const mainNavItems = [
  { name: "AI Brain", path: "/", icon: Brain },
  { name: "Market Brain", path: "/algobrain", icon: Radar },
  { name: "Performance", path: "/performance", icon: TrendingUp },
  // Broker Network: Manage and monitor broker connections, network status, and broker-related configurations
  // { name: "Broker Network", path: "/broker-network", icon: Network },
  // Client Protection: Security and compliance features for client data protection, risk management, and regulatory compliance
  // { name: "Client Protection", path: "/client-protection", icon: Lock },
  { name: "DCN Pipeline", path: "/dcn", icon: GitBranch },
  { name: "Trade Formation", path: "/trade-formation", icon: Zap },
  { name: "Account Rooms", path: "/accounts", icon: Layers },
  { name: "Trade Library", path: "/library", icon: PlayCircle },
  { name: "Market Conditions", path: "/conditions", icon: Radar },
  { name: "Audit Room", path: "/audit", icon: Shield },
  { name: "Market Radar", path: "/radar", icon: Radar },
  { name: "Execution", path: "/execution", icon: Zap },
  { name: "Strategy Suite", path: "/strategies", icon: Layers },
];

// Icon mapping for strategies
const getStrategyIcon = (name: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    'Nuvex': Target,
    'Xylo': BarChart3,
    'Drav': TrendingUp,
    'Yark': LineChart,
    'Tenzor': Cpu,
    'Omnix': PieChart,
  };
  return iconMap[name] || Target; // Default to Target if not found
};

// Generate path from strategy name
const getStrategyPath = (name: string): string => {
  return `/strategy/${name.toLowerCase()}`;
};

interface Strategy {
  id?: string;
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
}

const portfolioItems = [
  { name: "Portfolio", path: "/portfolio", icon: Briefcase },
  { name: "Transparency", path: "/transparency", icon: Shield },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [strategiesOpen, setStrategiesOpen] = useState(true);
  const location = useLocation();

  // Fetch strategies from API
  const { data: strategies = [], isLoading: strategiesLoading } = useQuery<Strategy[]>({
    queryKey: ['sidebar-strategies'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Strategy[]>('/admin/strategies', true); // Skip auth for public endpoint
        return response || [];
      } catch (error) {
        console.error('Failed to fetch strategies:', error);
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter to only active strategies and map to sidebar format
  const strategyItems = strategies
    .filter(strategy => strategy.status === 'active')
    .map(strategy => ({
      name: strategy.name,
      path: getStrategyPath(strategy.name),
      icon: getStrategyIcon(strategy.name),
    }));

  const isActiveStrategy = strategyItems.some(item => location.pathname === item.path);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 glass rounded-lg lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300",
          "bg-sidebar border-r border-sidebar-border",
          isOpen ? "w-64" : "w-0 lg:w-16",
          "overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              {isOpen && (
                <div>
                  <h1 className="font-display font-bold text-xl text-foreground">
                    Algofi<span className="text-primary">.ai</span>
                  </h1>
                  <p className="text-xs text-muted-foreground">Intelligence Core</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Navigation */}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent group",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  {isOpen && <span className="font-medium">{item.name}</span>}
                </NavLink>
              ))}
            </div>

            {/* Strategies Section */}
            <div>
              <button
                onClick={() => setStrategiesOpen(!strategiesOpen)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider",
                  "text-muted-foreground hover:text-foreground transition-colors",
                  isActiveStrategy && "text-primary"
                )}
              >
                {isOpen && (
                  <>
                    <span>Strategies</span>
                    {strategiesOpen ? (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </>
                )}
              </button>
              {(strategiesOpen || !isOpen) && (
                <div className="mt-1 space-y-1">
                  {strategiesLoading ? (
                    isOpen && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Loading strategies...
                      </div>
                    )
                  ) : strategyItems.length === 0 ? (
                    isOpen && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        No active strategies
                      </div>
                    )
                  ) : (
                    strategyItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                            "hover:bg-sidebar-accent group",
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-sidebar-foreground"
                          )
                        }
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0 group-hover:text-primary transition-colors" />
                        {isOpen && <span className="text-sm">{item.name}</span>}
                      </NavLink>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="space-y-1">
              {portfolioItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent group",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  {isOpen && <span className="font-medium">{item.name}</span>}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {isOpen && (
                <span className="text-xs text-muted-foreground">
                  System Active
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-50 p-2 glass rounded-lg hidden lg:block transition-all duration-300",
          isOpen ? "left-[17rem]" : "left-20",
          "top-6"
        )}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>
    </>
  );
}
