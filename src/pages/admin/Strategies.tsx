import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Trash2, Loader2, Edit, Save, X, ChevronDown, Check, ChevronRight, ChevronUp, Droplets, Activity, TrendingUp, BarChart3, LineChart, Cpu, PieChart, Shield, Gauge, Clock, TrendingDown, Layers, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

interface LiquidityZone {
  instrument: string;
  type: string;
  level: string;
  strength: number;
  status: string;
}

interface SMCZone {
  instrument: string;
  type: string;
  range: string;
  strength: number;
  planning: boolean;
}

interface SpreadData {
  label: string;
  value: number;
  sublabel: string;
}

interface ActivePair {
  symbol: string;
  spread: string;
  frequency: string;
  pnl: number;
}

interface TradeTape {
  time: string;
  dir: string;
  size: string;
  spread: string;
  pnl: number;
}

interface Instrument {
  symbol: string;
  price: string;
  trend: string;
  probability: number;
  status: string;
}

interface Pattern {
  instrument: string;
  timeframe: string;
  type: string;
  strength: number;
}

interface CorrelationPair {
  pair: string;
  correlation: number;
  strength: string;
}

interface VolatilityData {
  asset: string;
  h1: number;
  h4: number;
  d1: number;
}

interface TrendScanner {
  instrument: string;
  score: number;
  direction: string;
  momentum: string;
}

interface BreakoutWatchlist {
  instrument: string;
  level: string;
  distance: string;
  probability: number;
}

interface OpenPosition {
  instrument: string;
  entry: number;
  current: number;
  trail: number;
  pnl: number;
}

interface Factor {
  name: string;
  weight: number;
  active: boolean;
}

interface PortfolioExposure {
  category: string;
  value: number;
  color: string;
}

interface Scenario {
  trigger: string;
  exposure: string;
  action: string;
}

interface Strategy {
  id?: string;
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
  tagline?: string;
  holdingTime?: string;
  assets?: string[];
  edge?: string;
  risk?: 'conservative' | 'balanced' | 'aggressive';
  // Strategy-specific data
  liquidityZones?: LiquidityZone[];
  smcZones?: SMCZone[];
  spreadData?: SpreadData[];
  activePairs?: ActivePair[];
  tradeTape?: TradeTape[];
  instrumentGrid?: Instrument[];
  patterns?: Pattern[];
  correlationMatrix?: CorrelationPair[];
  volatilityData?: VolatilityData[];
  trendScanner?: TrendScanner[];
  breakoutWatchlist?: BreakoutWatchlist[];
  openPositions?: OpenPosition[];
  factors?: Factor[];
  portfolioExposure?: PortfolioExposure[];
  scenarios?: Scenario[];
  // Stats
  winRate?: number;
  avgRR?: number;
  liquiditySweeps?: number;
  activeZones?: number;
  dailyTrades?: number;
  avgSpreadCap?: number;
  dailyPnl?: number;
  maxDD?: number;
  activeTrades?: number;
  sharpeRatio?: number;
  pairsTracked?: number;
  avgWinner?: string;
  unrealizedPnl?: number;
  monthlyReturn?: number;
  maxInventoryPerSymbol?: number;
  maxSimultaneousMarkets?: number;
  maxTradesPerDay?: number;
  maxCorrelatedExposure?: number;
  dailyLossLimit?: number;
}

import { getAllSymbols } from '@/lib/trading-pairs';

// Available instruments list - now from JSON file
const AVAILABLE_INSTRUMENTS = [...getAllSymbols(), 'ALL'];

export default function Strategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    { 
      name: 'Nuvex', 
      status: 'active', 
      accuracy: 78, 
      confidence: 'high', 
      bias: 'Bullish Reversal', 
      instruments: ['XAUUSD', 'EURUSD', 'GBPUSD', 'NAS100'],
      tagline: 'Institutional Reversal Engine',
      winRate: 78,
      avgRR: 2.1,
      maxDD: -4.2,
      activeTrades: 3,
      instrumentGrid: [
        { symbol: 'XAUUSD', price: '2,034.50', trend: 'Overextended', probability: 78, status: 'watching' },
        { symbol: 'EURUSD', price: '1.0892', trend: 'Balanced', probability: 45, status: 'active' },
        { symbol: 'NAS100', price: '17,834', trend: 'Oversold', probability: 82, status: 'preparing' },
      ],
      patterns: [
        { instrument: 'XAUUSD', timeframe: 'H4', type: 'Bearish Engulfing', strength: 85 },
        { instrument: 'EURUSD', timeframe: 'H1', type: 'Bullish Engulfing', strength: 72 },
      ],
      maxTradesPerDay: 8,
      maxCorrelatedExposure: 40,
      dailyLossLimit: 5,
    },
    { 
      name: 'Xylo', 
      status: 'active', 
      accuracy: 82, 
      confidence: 'medium', 
      bias: 'Range / Mean-Revert', 
      instruments: ['BTCUSDT', 'ETHUSDT', 'EURUSD'],
      tagline: 'AI Market Maker',
      dailyTrades: 1247,
      winRate: 82,
      avgSpreadCap: 0.18,
      dailyPnl: 2578,
      spreadData: [
        { label: 'EURUSD', value: 92, sublabel: '0.2 pips' },
        { label: 'BTCUSDT', value: 78, sublabel: '12 USD' },
        { label: 'XAUUSD', value: 85, sublabel: '0.15' },
      ],
      activePairs: [
        { symbol: 'EURUSD', spread: '0.2', frequency: '245/hr', pnl: 342.50 },
        { symbol: 'BTCUSDT', spread: '12.5', frequency: '89/hr', pnl: 1245.00 },
      ],
      tradeTape: [
        { time: '14:32:45', dir: 'BUY', size: '0.10', spread: '0.2', pnl: 2.40 },
        { time: '14:32:44', dir: 'SELL', size: '0.08', spread: '0.2', pnl: 1.80 },
      ],
      maxInventoryPerSymbol: 50000,
      maxSimultaneousMarkets: 6,
    },
    { 
      name: 'Drav', 
      status: 'waiting', 
      accuracy: 71, 
      confidence: 'high', 
      bias: 'SMC Liquidity Hunt', 
      instruments: ['XAUUSD', 'NAS100', 'US30'],
      tagline: 'Smart Money AI',
      winRate: 71,
      avgRR: 3.2,
      liquiditySweeps: 24,
      activeZones: 8,
      liquidityZones: [
        { instrument: 'XAUUSD', type: 'Equal Highs', level: '2045.50', strength: 92, status: 'watching' },
        { instrument: 'NAS100', type: 'Equal Lows', level: '17650', strength: 85, status: 'preparing' },
      ],
      smcZones: [
        { instrument: 'XAUUSD', type: 'Supply Zone', range: '2042-2048', strength: 89, planning: true },
        { instrument: 'NAS100', type: 'Demand Zone', range: '17580-17620', strength: 76, planning: true },
      ],
    },
    { 
      name: 'Yark', 
      status: 'active', 
      accuracy: 85, 
      confidence: 'high', 
      bias: 'Statistical Edge', 
      instruments: ['EURUSD', 'GBPJPY', 'AUDUSD', 'BTCUSDT'],
      tagline: 'Quantitative Statistical Engine',
      winRate: 85,
      sharpeRatio: 2.4,
      pairsTracked: 48,
      activeTrades: 6,
      correlationMatrix: [
        { pair: 'EURUSD / GBPUSD', correlation: 0.85, strength: 'Strong+' },
        { pair: 'NAS100 / SPX500', correlation: 0.92, strength: 'Strong+' },
        { pair: 'BTCUSD / ETHUSD', correlation: 0.78, strength: 'Strong' },
      ],
      volatilityData: [
        { asset: 'XAUUSD', h1: 68, h4: 72, d1: 58 },
        { asset: 'BTCUSD', h1: 85, h4: 78, d1: 82 },
        { asset: 'EURUSD', h1: 35, h4: 42, d1: 38 },
      ],
    },
    { 
      name: 'Tenzor', 
      status: 'cooling', 
      accuracy: 76, 
      confidence: 'medium', 
      bias: 'Momentum Breakout', 
      instruments: ['TSLA', 'AAPL', 'NAS100', 'BTCUSDT'],
      tagline: 'Momentum & Trend Engine',
      winRate: 76,
      avgWinner: '+2.8R',
      activeTrades: 3,
      unrealizedPnl: 2992,
      trendScanner: [
        { instrument: 'TSLA', score: 92, direction: 'up', momentum: 'Strong' },
        { instrument: 'BTCUSDT', score: 87, direction: 'up', momentum: 'Strong' },
        { instrument: 'NAS100', score: 78, direction: 'up', momentum: 'Moderate' },
      ],
      breakoutWatchlist: [
        { instrument: 'AAPL', level: '195.00', distance: '2.8%', probability: 72 },
        { instrument: 'MSFT', level: '420.00', distance: '1.5%', probability: 81 },
      ],
      openPositions: [
        { instrument: 'TSLA', entry: 238.50, current: 245.30, trail: 240.00, pnl: 680 },
        { instrument: 'BTCUSDT', entry: 42500, current: 43892, trail: 43000, pnl: 1392 },
      ],
    },
    { 
      name: 'Omnix', 
      status: 'active', 
      accuracy: 89, 
      confidence: 'high', 
      bias: 'Multi-Factor Balanced', 
      instruments: ['ALL'],
      tagline: 'Multi-Factor Hedge Fund Brain',
      sharpeRatio: 2.8,
      maxDD: -3.2,
      monthlyReturn: 8.4,
      factors: [
        { name: 'Trend', weight: 28, active: true },
        { name: 'Mean Reversion', weight: 22, active: true },
        { name: 'Volatility', weight: 18, active: true },
        { name: 'Liquidity', weight: 15, active: true },
        { name: 'Regime', weight: 17, active: true },
      ],
      portfolioExposure: [
        { category: 'Forex', value: 25, color: 'bg-blue-500' },
        { category: 'Indices', value: 20, color: 'bg-green-500' },
        { category: 'Stocks', value: 18, color: 'bg-purple-500' },
        { category: 'Crypto', value: 22, color: 'bg-orange-500' },
        { category: 'Gold', value: 15, color: 'bg-yellow-500' },
      ],
      scenarios: [
        { trigger: 'Volatility spikes +50%', exposure: '-15%', action: 'Reduce position sizes, tighten stops' },
        { trigger: 'Equities drop 3%', exposure: '-20%', action: 'Hedge with VIX, reduce long equity' },
      ],
    },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Strategy[]>('/admin/strategies');
        if (response && Array.isArray(response)) {
          setStrategies(response);
        }
        return response;
      } catch (error) {
        return strategies;
      }
    },
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: async (strategiesData: Strategy[]) => {
      return await apiClient.post('/admin/strategies', strategiesData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: 'Success',
        description: 'Strategies updated successfully',
      });
      setEditingIndex(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update strategies',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(strategies);
  };

  const handleUpdateStrategy = (index: number, field: keyof Strategy, value: any) => {
    const updated = strategies.map((strategy, i) =>
      i === index ? { ...strategy, [field]: value } : strategy
    );
    setStrategies(updated);
  };

  const handleUpdateInstruments = (index: number, instruments: string) => {
    const instrumentsArray = instruments.split(',').map(i => i.trim()).filter(Boolean);
    handleUpdateStrategy(index, 'instruments', instrumentsArray);
  };

  const handleUpdateAssets = (index: number, assets: string) => {
    const assetsArray = assets.split(',').map(a => a.trim()).filter(Boolean);
    handleUpdateStrategy(index, 'assets', assetsArray);
  };

  const handleToggleInstrument = (index: number, instrument: string) => {
    const strategy = strategies[index];
    const currentInstruments = strategy.instruments;
    const isSelected = currentInstruments.includes(instrument);
    
    let newInstruments: string[];
    if (instrument === 'ALL') {
      // If ALL is selected, replace everything with ALL
      newInstruments = isSelected ? [] : ['ALL'];
    } else {
      // If ALL was selected, remove it first
      const withoutAll = currentInstruments.filter(i => i !== 'ALL');
      if (isSelected) {
        newInstruments = withoutAll.filter(i => i !== instrument);
      } else {
        newInstruments = [...withoutAll, instrument];
      }
    }
    
    handleUpdateStrategy(index, 'instruments', newInstruments);
  };

  const handleAddStrategy = () => {
    setStrategies([...strategies, {
      name: 'New Strategy',
      status: 'waiting',
      accuracy: 0,
      confidence: 'medium',
      bias: '',
      instruments: [],
      tagline: '',
      holdingTime: '',
      assets: [],
      edge: '',
      risk: 'balanced',
    }]);
    setEditingIndex(strategies.length);
  };

  const handleRemoveStrategy = (index: number) => {
    setStrategies(strategies.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'waiting':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'cooling':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderStrategyExpandedView = (strategy: Strategy, index: number) => {
    if (expandedStrategy !== index) return null;

    const strategyName = strategy.name.toLowerCase();
    
    return (
      <div className="mt-6 space-y-6 border-t pt-6">
        {/* Drav Strategy */}
        {strategyName === 'drav' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Liquidity Zones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.liquidityZones || []).map((zone, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={zone.instrument}
                      onValueChange={(value) => {
                        const updated = [...(strategy.liquidityZones || [])];
                        updated[i] = { ...zone, instrument: value };
                        handleUpdateStrategy(index, 'liquidityZones', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={zone.type}
                      onChange={(e) => {
                        const updated = [...(strategy.liquidityZones || [])];
                        updated[i] = { ...zone, type: e.target.value };
                        handleUpdateStrategy(index, 'liquidityZones', updated);
                      }}
                      placeholder="Type"
                      className="bg-background"
                    />
                    <Input
                      value={zone.level}
                      onChange={(e) => {
                        const updated = [...(strategy.liquidityZones || [])];
                        updated[i] = { ...zone, level: e.target.value };
                        handleUpdateStrategy(index, 'liquidityZones', updated);
                      }}
                      placeholder="Level"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={zone.strength}
                      onChange={(e) => {
                        const updated = [...(strategy.liquidityZones || [])];
                        updated[i] = { ...zone, strength: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'liquidityZones', updated);
                      }}
                      placeholder="Strength"
                      className="bg-background"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={zone.status}
                        onChange={(e) => {
                          const updated = [...(strategy.liquidityZones || [])];
                          updated[i] = { ...zone, status: e.target.value };
                          handleUpdateStrategy(index, 'liquidityZones', updated);
                        }}
                        placeholder="Status"
                        className="bg-background"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = (strategy.liquidityZones || []).filter((_, idx) => idx !== i);
                          handleUpdateStrategy(index, 'liquidityZones', updated);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.liquidityZones || []), {
                      instrument: '',
                      type: '',
                      level: '',
                      strength: 0,
                      status: 'watching',
                    }];
                    handleUpdateStrategy(index, 'liquidityZones', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Liquidity Zone
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  SMC Zones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.smcZones || []).map((zone, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={zone.instrument}
                      onValueChange={(value) => {
                        const updated = [...(strategy.smcZones || [])];
                        updated[i] = { ...zone, instrument: value };
                        handleUpdateStrategy(index, 'smcZones', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={zone.type}
                      onChange={(e) => {
                        const updated = [...(strategy.smcZones || [])];
                        updated[i] = { ...zone, type: e.target.value };
                        handleUpdateStrategy(index, 'smcZones', updated);
                      }}
                      placeholder="Type"
                      className="bg-background"
                    />
                    <Input
                      value={zone.range}
                      onChange={(e) => {
                        const updated = [...(strategy.smcZones || [])];
                        updated[i] = { ...zone, range: e.target.value };
                        handleUpdateStrategy(index, 'smcZones', updated);
                      }}
                      placeholder="Range"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={zone.strength}
                      onChange={(e) => {
                        const updated = [...(strategy.smcZones || [])];
                        updated[i] = { ...zone, strength: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'smcZones', updated);
                      }}
                      placeholder="Strength"
                      className="bg-background"
                    />
                    <div className="flex gap-2">
                      <Select
                        value={zone.planning ? 'true' : 'false'}
                        onValueChange={(v) => {
                          const updated = [...(strategy.smcZones || [])];
                          updated[i] = { ...zone, planning: v === 'true' };
                          handleUpdateStrategy(index, 'smcZones', updated);
                        }}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Planning</SelectItem>
                          <SelectItem value="false">Not Planning</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = (strategy.smcZones || []).filter((_, idx) => idx !== i);
                          handleUpdateStrategy(index, 'smcZones', updated);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.smcZones || []), {
                      instrument: '',
                      type: '',
                      range: '',
                      strength: 0,
                      planning: false,
                    }];
                    handleUpdateStrategy(index, 'smcZones', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add SMC Zone
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Win Rate (%)</Label>
                <Input
                  type="number"
                  value={strategy.winRate || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'winRate', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Avg R:R</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={strategy.avgRR || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'avgRR', parseFloat(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Liquidity Sweeps</Label>
                <Input
                  type="number"
                  value={strategy.liquiditySweeps || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'liquiditySweeps', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Active Zones</Label>
                <Input
                  type="number"
                  value={strategy.activeZones || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'activeZones', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
            </div>
          </>
        )}

        {/* Xylo Strategy */}
        {strategyName === 'xylo' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Spread Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.spreadData || []).map((data, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={data.label}
                      onValueChange={(value) => {
                        const updated = [...(strategy.spreadData || [])];
                        updated[i] = { ...data, label: value };
                        handleUpdateStrategy(index, 'spreadData', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={data.value}
                      onChange={(e) => {
                        const updated = [...(strategy.spreadData || [])];
                        updated[i] = { ...data, value: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'spreadData', updated);
                      }}
                      placeholder="Value"
                      className="bg-background"
                    />
                    <Input
                      value={data.sublabel}
                      onChange={(e) => {
                        const updated = [...(strategy.spreadData || [])];
                        updated[i] = { ...data, sublabel: e.target.value };
                        handleUpdateStrategy(index, 'spreadData', updated);
                      }}
                      placeholder="Sublabel"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.spreadData || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'spreadData', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.spreadData || []), { label: '', value: 0, sublabel: '' }];
                    handleUpdateStrategy(index, 'spreadData', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Spread Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Active Pairs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.activePairs || []).map((pair, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={pair.symbol}
                      onValueChange={(value) => {
                        const updated = [...(strategy.activePairs || [])];
                        updated[i] = { ...pair, symbol: value };
                        handleUpdateStrategy(index, 'activePairs', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={pair.spread}
                      onChange={(e) => {
                        const updated = [...(strategy.activePairs || [])];
                        updated[i] = { ...pair, spread: e.target.value };
                        handleUpdateStrategy(index, 'activePairs', updated);
                      }}
                      placeholder="Spread"
                      className="bg-background"
                    />
                    <Input
                      value={pair.frequency}
                      onChange={(e) => {
                        const updated = [...(strategy.activePairs || [])];
                        updated[i] = { ...pair, frequency: e.target.value };
                        handleUpdateStrategy(index, 'activePairs', updated);
                      }}
                      placeholder="Frequency"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={pair.pnl}
                      onChange={(e) => {
                        const updated = [...(strategy.activePairs || [])];
                        updated[i] = { ...pair, pnl: parseFloat(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'activePairs', updated);
                      }}
                      placeholder="P&L"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.activePairs || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'activePairs', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.activePairs || []), { symbol: '', spread: '', frequency: '', pnl: 0 }];
                    handleUpdateStrategy(index, 'activePairs', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Active Pair
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Daily Trades</Label>
                <Input
                  type="number"
                  value={strategy.dailyTrades || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'dailyTrades', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Avg Spread Cap</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={strategy.avgSpreadCap || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'avgSpreadCap', parseFloat(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Daily P&L</Label>
                <Input
                  type="number"
                  value={strategy.dailyPnl || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'dailyPnl', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Inventory Per Symbol</Label>
                <Input
                  type="number"
                  value={strategy.maxInventoryPerSymbol || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'maxInventoryPerSymbol', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Simultaneous Markets</Label>
                <Input
                  type="number"
                  value={strategy.maxSimultaneousMarkets || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'maxSimultaneousMarkets', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
            </div>
          </>
        )}

        {/* Nuvex Strategy */}
        {strategyName === 'nuvex' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Instrument Grid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.instrumentGrid || []).map((inst, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={inst.symbol}
                      onValueChange={(value) => {
                        const updated = [...(strategy.instrumentGrid || [])];
                        updated[i] = { ...inst, symbol: value };
                        handleUpdateStrategy(index, 'instrumentGrid', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((sym) => (
                          <SelectItem key={sym} value={sym}>{sym}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={inst.price}
                      onChange={(e) => {
                        const updated = [...(strategy.instrumentGrid || [])];
                        updated[i] = { ...inst, price: e.target.value };
                        handleUpdateStrategy(index, 'instrumentGrid', updated);
                      }}
                      placeholder="Price"
                      className="bg-background"
                    />
                    <Input
                      value={inst.trend}
                      onChange={(e) => {
                        const updated = [...(strategy.instrumentGrid || [])];
                        updated[i] = { ...inst, trend: e.target.value };
                        handleUpdateStrategy(index, 'instrumentGrid', updated);
                      }}
                      placeholder="Trend"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={inst.probability}
                      onChange={(e) => {
                        const updated = [...(strategy.instrumentGrid || [])];
                        updated[i] = { ...inst, probability: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'instrumentGrid', updated);
                      }}
                      placeholder="Probability"
                      className="bg-background"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={inst.status}
                        onChange={(e) => {
                          const updated = [...(strategy.instrumentGrid || [])];
                          updated[i] = { ...inst, status: e.target.value };
                          handleUpdateStrategy(index, 'instrumentGrid', updated);
                        }}
                        placeholder="Status"
                        className="bg-background"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = (strategy.instrumentGrid || []).filter((_, idx) => idx !== i);
                          handleUpdateStrategy(index, 'instrumentGrid', updated);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.instrumentGrid || []), { symbol: '', price: '', trend: '', probability: 0, status: 'watching' }];
                    handleUpdateStrategy(index, 'instrumentGrid', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Instrument
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.patterns || []).map((pattern, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={pattern.instrument}
                      onValueChange={(value) => {
                        const updated = [...(strategy.patterns || [])];
                        updated[i] = { ...pattern, instrument: value };
                        handleUpdateStrategy(index, 'patterns', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={pattern.timeframe}
                      onChange={(e) => {
                        const updated = [...(strategy.patterns || [])];
                        updated[i] = { ...pattern, timeframe: e.target.value };
                        handleUpdateStrategy(index, 'patterns', updated);
                      }}
                      placeholder="Timeframe"
                      className="bg-background"
                    />
                    <Input
                      value={pattern.type}
                      onChange={(e) => {
                        const updated = [...(strategy.patterns || [])];
                        updated[i] = { ...pattern, type: e.target.value };
                        handleUpdateStrategy(index, 'patterns', updated);
                      }}
                      placeholder="Type"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={pattern.strength}
                      onChange={(e) => {
                        const updated = [...(strategy.patterns || [])];
                        updated[i] = { ...pattern, strength: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'patterns', updated);
                      }}
                      placeholder="Strength"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.patterns || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'patterns', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.patterns || []), { instrument: '', timeframe: '', type: '', strength: 0 }];
                    handleUpdateStrategy(index, 'patterns', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pattern
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Trades Per Day</Label>
                <Input
                  type="number"
                  value={strategy.maxTradesPerDay || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'maxTradesPerDay', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Correlated Exposure (%)</Label>
                <Input
                  type="number"
                  value={strategy.maxCorrelatedExposure || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'maxCorrelatedExposure', parseInt(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Loss Limit (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={strategy.dailyLossLimit || 0}
                  onChange={(e) => handleUpdateStrategy(index, 'dailyLossLimit', parseFloat(e.target.value) || 0)}
                  className="bg-background"
                />
              </div>
            </div>
          </>
        )}

        {/* Yark Strategy */}
        {strategyName === 'yark' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Correlation Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.correlationMatrix || []).map((pair, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Input
                      value={pair.pair}
                      onChange={(e) => {
                        const updated = [...(strategy.correlationMatrix || [])];
                        updated[i] = { ...pair, pair: e.target.value };
                        handleUpdateStrategy(index, 'correlationMatrix', updated);
                      }}
                      placeholder="Pair"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={pair.correlation}
                      onChange={(e) => {
                        const updated = [...(strategy.correlationMatrix || [])];
                        updated[i] = { ...pair, correlation: parseFloat(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'correlationMatrix', updated);
                      }}
                      placeholder="Correlation"
                      className="bg-background"
                    />
                    <Input
                      value={pair.strength}
                      onChange={(e) => {
                        const updated = [...(strategy.correlationMatrix || [])];
                        updated[i] = { ...pair, strength: e.target.value };
                        handleUpdateStrategy(index, 'correlationMatrix', updated);
                      }}
                      placeholder="Strength"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.correlationMatrix || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'correlationMatrix', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.correlationMatrix || []), { pair: '', correlation: 0, strength: '' }];
                    handleUpdateStrategy(index, 'correlationMatrix', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Correlation Pair
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Volatility Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.volatilityData || []).map((data, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={data.asset}
                      onValueChange={(value) => {
                        const updated = [...(strategy.volatilityData || [])];
                        updated[i] = { ...data, asset: value };
                        handleUpdateStrategy(index, 'volatilityData', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((asset) => (
                          <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={data.h1}
                      onChange={(e) => {
                        const updated = [...(strategy.volatilityData || [])];
                        updated[i] = { ...data, h1: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'volatilityData', updated);
                      }}
                      placeholder="H1"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={data.h4}
                      onChange={(e) => {
                        const updated = [...(strategy.volatilityData || [])];
                        updated[i] = { ...data, h4: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'volatilityData', updated);
                      }}
                      placeholder="H4"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={data.d1}
                      onChange={(e) => {
                        const updated = [...(strategy.volatilityData || [])];
                        updated[i] = { ...data, d1: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'volatilityData', updated);
                      }}
                      placeholder="D1"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.volatilityData || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'volatilityData', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.volatilityData || []), { asset: '', h1: 0, h4: 0, d1: 0 }];
                    handleUpdateStrategy(index, 'volatilityData', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Volatility Data
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tenzor Strategy */}
        {strategyName === 'tenzor' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trend Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.trendScanner || []).map((item, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={item.instrument}
                      onValueChange={(value) => {
                        const updated = [...(strategy.trendScanner || [])];
                        updated[i] = { ...item, instrument: value };
                        handleUpdateStrategy(index, 'trendScanner', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={item.score}
                      onChange={(e) => {
                        const updated = [...(strategy.trendScanner || [])];
                        updated[i] = { ...item, score: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'trendScanner', updated);
                      }}
                      placeholder="Score"
                      className="bg-background"
                    />
                    <Input
                      value={item.direction}
                      onChange={(e) => {
                        const updated = [...(strategy.trendScanner || [])];
                        updated[i] = { ...item, direction: e.target.value };
                        handleUpdateStrategy(index, 'trendScanner', updated);
                      }}
                      placeholder="Direction"
                      className="bg-background"
                    />
                    <Input
                      value={item.momentum}
                      onChange={(e) => {
                        const updated = [...(strategy.trendScanner || [])];
                        updated[i] = { ...item, momentum: e.target.value };
                        handleUpdateStrategy(index, 'trendScanner', updated);
                      }}
                      placeholder="Momentum"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.trendScanner || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'trendScanner', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.trendScanner || []), { instrument: '', score: 0, direction: '', momentum: '' }];
                    handleUpdateStrategy(index, 'trendScanner', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trend Scanner Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Breakout Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.breakoutWatchlist || []).map((item, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={item.instrument}
                      onValueChange={(value) => {
                        const updated = [...(strategy.breakoutWatchlist || [])];
                        updated[i] = { ...item, instrument: value };
                        handleUpdateStrategy(index, 'breakoutWatchlist', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={item.level}
                      onChange={(e) => {
                        const updated = [...(strategy.breakoutWatchlist || [])];
                        updated[i] = { ...item, level: e.target.value };
                        handleUpdateStrategy(index, 'breakoutWatchlist', updated);
                      }}
                      placeholder="Level"
                      className="bg-background"
                    />
                    <Input
                      value={item.distance}
                      onChange={(e) => {
                        const updated = [...(strategy.breakoutWatchlist || [])];
                        updated[i] = { ...item, distance: e.target.value };
                        handleUpdateStrategy(index, 'breakoutWatchlist', updated);
                      }}
                      placeholder="Distance"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={item.probability}
                      onChange={(e) => {
                        const updated = [...(strategy.breakoutWatchlist || [])];
                        updated[i] = { ...item, probability: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'breakoutWatchlist', updated);
                      }}
                      placeholder="Probability"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.breakoutWatchlist || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'breakoutWatchlist', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.breakoutWatchlist || []), { instrument: '', level: '', distance: '', probability: 0 }];
                    handleUpdateStrategy(index, 'breakoutWatchlist', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Breakout Watchlist Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Open Positions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.openPositions || []).map((pos, i) => (
                  <div key={i} className="grid grid-cols-6 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Select
                      value={pos.instrument}
                      onValueChange={(value) => {
                        const updated = [...(strategy.openPositions || [])];
                        updated[i] = { ...pos, instrument: value };
                        handleUpdateStrategy(index, 'openPositions', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INSTRUMENTS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      value={pos.entry}
                      onChange={(e) => {
                        const updated = [...(strategy.openPositions || [])];
                        updated[i] = { ...pos, entry: parseFloat(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'openPositions', updated);
                      }}
                      placeholder="Entry"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={pos.current}
                      onChange={(e) => {
                        const updated = [...(strategy.openPositions || [])];
                        updated[i] = { ...pos, current: parseFloat(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'openPositions', updated);
                      }}
                      placeholder="Current"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={pos.trail}
                      onChange={(e) => {
                        const updated = [...(strategy.openPositions || [])];
                        updated[i] = { ...pos, trail: parseFloat(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'openPositions', updated);
                      }}
                      placeholder="Trail"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={pos.pnl}
                      onChange={(e) => {
                        const updated = [...(strategy.openPositions || [])];
                        updated[i] = { ...pos, pnl: parseFloat(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'openPositions', updated);
                      }}
                      placeholder="P&L"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.openPositions || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'openPositions', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.openPositions || []), { instrument: '', entry: 0, current: 0, trail: 0, pnl: 0 }];
                    handleUpdateStrategy(index, 'openPositions', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Open Position
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Omnix Strategy */}
        {strategyName === 'omnix' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.factors || []).map((factor, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Input
                      value={factor.name}
                      onChange={(e) => {
                        const updated = [...(strategy.factors || [])];
                        updated[i] = { ...factor, name: e.target.value };
                        handleUpdateStrategy(index, 'factors', updated);
                      }}
                      placeholder="Name"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={factor.weight}
                      onChange={(e) => {
                        const updated = [...(strategy.factors || [])];
                        updated[i] = { ...factor, weight: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'factors', updated);
                      }}
                      placeholder="Weight"
                      className="bg-background"
                    />
                    <Select
                      value={factor.active ? 'true' : 'false'}
                      onValueChange={(v) => {
                        const updated = [...(strategy.factors || [])];
                        updated[i] = { ...factor, active: v === 'true' };
                        handleUpdateStrategy(index, 'factors', updated);
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.factors || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'factors', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.factors || []), { name: '', weight: 0, active: true }];
                    handleUpdateStrategy(index, 'factors', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Factor
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Portfolio Exposure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.portfolioExposure || []).map((exp, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg">
                    <Input
                      value={exp.category}
                      onChange={(e) => {
                        const updated = [...(strategy.portfolioExposure || [])];
                        updated[i] = { ...exp, category: e.target.value };
                        handleUpdateStrategy(index, 'portfolioExposure', updated);
                      }}
                      placeholder="Category"
                      className="bg-background"
                    />
                    <Input
                      type="number"
                      value={exp.value}
                      onChange={(e) => {
                        const updated = [...(strategy.portfolioExposure || [])];
                        updated[i] = { ...exp, value: parseInt(e.target.value) || 0 };
                        handleUpdateStrategy(index, 'portfolioExposure', updated);
                      }}
                      placeholder="Value (%)"
                      className="bg-background"
                    />
                    <Input
                      value={exp.color}
                      onChange={(e) => {
                        const updated = [...(strategy.portfolioExposure || [])];
                        updated[i] = { ...exp, color: e.target.value };
                        handleUpdateStrategy(index, 'portfolioExposure', updated);
                      }}
                      placeholder="Color (e.g., bg-blue-500)"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = (strategy.portfolioExposure || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'portfolioExposure', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.portfolioExposure || []), { category: '', value: 0, color: '' }];
                    handleUpdateStrategy(index, 'portfolioExposure', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Portfolio Exposure
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(strategy.scenarios || []).map((scenario, i) => (
                  <div key={i} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                    <Input
                      value={scenario.trigger}
                      onChange={(e) => {
                        const updated = [...(strategy.scenarios || [])];
                        updated[i] = { ...scenario, trigger: e.target.value };
                        handleUpdateStrategy(index, 'scenarios', updated);
                      }}
                      placeholder="Trigger"
                      className="bg-background"
                    />
                    <Input
                      value={scenario.exposure}
                      onChange={(e) => {
                        const updated = [...(strategy.scenarios || [])];
                        updated[i] = { ...scenario, exposure: e.target.value };
                        handleUpdateStrategy(index, 'scenarios', updated);
                      }}
                      placeholder="Exposure"
                      className="bg-background"
                    />
                    <Textarea
                      value={scenario.action}
                      onChange={(e) => {
                        const updated = [...(strategy.scenarios || [])];
                        updated[i] = { ...scenario, action: e.target.value };
                        handleUpdateStrategy(index, 'scenarios', updated);
                      }}
                      placeholder="Action"
                      className="bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = (strategy.scenarios || []).filter((_, idx) => idx !== i);
                        handleUpdateStrategy(index, 'scenarios', updated);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...(strategy.scenarios || []), { trigger: '', exposure: '', action: '' }];
                    handleUpdateStrategy(index, 'scenarios', updated);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Scenario
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">Strategies</h1>
          <p className="text-muted-foreground mt-2">Manage trading strategies configuration</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy, index) => (
          <Card 
            key={index} 
            className={cn(
              "bg-card border-border",
              expandedStrategy === index && "md:col-span-2 lg:col-span-3"
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-foreground">
                    {editingIndex === index ? (
                      <Input
                        value={strategy.name}
                        onChange={(e) => handleUpdateStrategy(index, 'name', e.target.value)}
                        className="bg-background border-input text-foreground h-8"
                      />
                    ) : (
                      strategy.name
                    )}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedStrategy(expandedStrategy === index ? null : index)}
                    title={expandedStrategy === index ? "Collapse" : "Expand"}
                  >
                    {expandedStrategy === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                  {editingIndex === index ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingIndex(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingIndex(index)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStrategy(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingIndex === index ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-foreground">Status</Label>
                    <Select
                      value={strategy.status}
                      onValueChange={(value) => handleUpdateStrategy(index, 'status', value)}
                    >
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="cooling">Cooling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Accuracy (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={strategy.accuracy}
                      onChange={(e) => handleUpdateStrategy(index, 'accuracy', parseInt(e.target.value) || 0)}
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Confidence</Label>
                    <Select
                      value={strategy.confidence}
                      onValueChange={(value) => handleUpdateStrategy(index, 'confidence', value)}
                    >
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Tagline</Label>
                    <Input
                      value={strategy.tagline || ''}
                      onChange={(e) => handleUpdateStrategy(index, 'tagline', e.target.value)}
                      placeholder="e.g., Institutional Reversal Engine"
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Bias</Label>
                    <Input
                      value={strategy.bias}
                      onChange={(e) => handleUpdateStrategy(index, 'bias', e.target.value)}
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Edge</Label>
                    <Input
                      value={strategy.edge || ''}
                      onChange={(e) => handleUpdateStrategy(index, 'edge', e.target.value)}
                      placeholder="e.g., Engulfing Reversals, RSI Divergence"
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Holding Time</Label>
                    <Input
                      value={strategy.holdingTime || ''}
                      onChange={(e) => handleUpdateStrategy(index, 'holdingTime', e.target.value)}
                      placeholder="e.g., Intraday / Swing"
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Risk Level</Label>
                    <Select
                      value={strategy.risk || 'balanced'}
                      onValueChange={(value) => handleUpdateStrategy(index, 'risk', value)}
                    >
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Asset Classes</Label>
                    <Input
                      value={strategy.assets?.join(', ') || ''}
                      onChange={(e) => handleUpdateAssets(index, e.target.value)}
                      placeholder="e.g., Forex, Gold, Indices, Stocks"
                      className="bg-background border-input text-foreground"
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Instruments</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between bg-background border-input text-foreground"
                        >
                          <span className="truncate">
                            {strategy.instruments.length === 0
                              ? 'Select instruments...'
                              : strategy.instruments.length === 1
                              ? strategy.instruments[0]
                              : `${strategy.instruments.length} selected`}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0 bg-popover border-border" align="start">
                        <Command className="bg-popover">
                          <CommandInput placeholder="Search instruments..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No instruments found.</CommandEmpty>
                            <CommandGroup>
                              {AVAILABLE_INSTRUMENTS.map((instrument) => {
                                const isSelected = strategy.instruments.includes(instrument);
                                return (
                                  <CommandItem
                                    key={instrument}
                                    value={instrument}
                                    onSelect={() => handleToggleInstrument(index, instrument)}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center space-x-2 w-full">
                                      <div
                                        className={cn(
                                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                          isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "opacity-50 [&_svg]:invisible"
                                        )}
                                      >
                                        <Check className="h-4 w-4" />
                                      </div>
                                      <span>{instrument}</span>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {strategy.instruments.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {strategy.instruments.map((inst) => (
                          <Badge key={inst} variant="secondary" className="text-xs">
                            {inst}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(strategy.status)}>
                      {strategy.status}
                    </Badge>
                    <Badge className={getConfidenceColor(strategy.confidence)}>
                      {strategy.confidence}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-2xl font-bold text-foreground">{strategy.accuracy}%</p>
                  </div>
                  {strategy.tagline && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tagline</p>
                      <p className="text-sm text-foreground">{strategy.tagline}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Bias</p>
                    <p className="text-sm text-foreground">{strategy.bias}</p>
                  </div>
                  {strategy.edge && (
                    <div>
                      <p className="text-sm text-muted-foreground">Edge</p>
                      <p className="text-sm text-foreground">{strategy.edge}</p>
                    </div>
                  )}
                  {strategy.holdingTime && (
                    <div>
                      <p className="text-sm text-muted-foreground">Holding Time</p>
                      <p className="text-sm text-foreground">{strategy.holdingTime}</p>
                    </div>
                  )}
                  {strategy.risk && (
                    <div>
                      <p className="text-sm text-muted-foreground">Risk</p>
                      <Badge variant="outline" className="capitalize">
                        {strategy.risk}
                      </Badge>
                    </div>
                  )}
                  {strategy.assets && strategy.assets.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Asset Classes</p>
                      <div className="flex flex-wrap gap-1">
                        {strategy.assets.map((asset, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Instruments</p>
                    <div className="flex flex-wrap gap-1">
                      {strategy.instruments.map((inst, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {inst}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            {renderStrategyExpandedView(strategy, index)}
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleAddStrategy}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Strategy
      </Button>
    </div>
  );
}


