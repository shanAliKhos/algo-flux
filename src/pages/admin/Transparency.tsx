import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Plus, Trash2, Shield } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { getAllSymbols } from '@/lib/trading-pairs';

interface TransparencyData {
  complianceStats: {
    maxLeverage: string;
    currentLeverage: string;
    maxDrawdown: string;
    observedDrawdown: string;
    avgSlippage: string;
    fillRate: string;
  };
  recentTrades: Array<{
    id: string;
    time: string;
    instrument: string;
    strategy: string;
    direction: 'buy' | 'sell';
    entry: number;
    size: string;
    status: string;
  }>;
  strategyPerformance: Array<{
    name: string;
    trades: number;
    winRate: number;
    avgR: number;
    pnl: number;
  }>;
  topInstruments: Array<{
    symbol: string;
    trades: number;
    volume: string;
    pnl: number;
  }>;
  riskCompliance: {
    currentLeverage: string;
    leverageLimit: string;
    currentDD: string;
    maxObservedDD: string;
    slippageStats: string;
    maxSlippage: string;
    venues: number;
    primeBrokers: number;
  };
}

interface Strategy {
  id?: string;
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
}

export default function TransparencyAdmin() {
  const [formData, setFormData] = useState<TransparencyData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['transparency'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<TransparencyData>('/admin/transparency', true);
        if (response) {
          setFormData(response);
        }
        return response;
      } catch (error) {
        console.error('Failed to fetch transparency data:', error);
        return null;
      }
    },
    retry: 1,
  });

  // Fetch strategies for the select dropdown
  const { data: strategies = [] } = useQuery<Strategy[]>({
    queryKey: ['strategies'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Strategy[]>('/admin/strategies');
        return response || [];
      } catch (error) {
        console.error('Failed to fetch strategies:', error);
        return [];
      }
    },
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: async (transparencyData: TransparencyData) => {
      return await apiClient.post('/admin/transparency', transparencyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency'] });
      toast({
        title: 'Success',
        description: 'Transparency data updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update transparency data',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (formData) {
      updateMutation.mutate(formData);
    }
  };

  const handleAddTrade = () => {
    if (formData) {
      setFormData({
        ...formData,
        recentTrades: [
          ...formData.recentTrades,
          {
            id: Date.now().toString(),
            time: '00:00:00',
            instrument: '',
            strategy: '',
            direction: 'buy',
            entry: 0,
            size: '0',
            status: 'Filled',
          },
        ],
      });
    }
  };

  const handleRemoveTrade = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        recentTrades: formData.recentTrades.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddStrategy = () => {
    if (formData) {
      setFormData({
        ...formData,
        strategyPerformance: [
          ...formData.strategyPerformance,
          {
            name: '',
            trades: 0,
            winRate: 0,
            avgR: 0,
            pnl: 0,
          },
        ],
      });
    }
  };

  const handleRemoveStrategy = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        strategyPerformance: formData.strategyPerformance.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddInstrument = () => {
    if (formData) {
      setFormData({
        ...formData,
        topInstruments: [
          ...formData.topInstruments,
          {
            symbol: '',
            trades: 0,
            volume: '$0',
            pnl: 0,
          },
        ],
      });
    }
  };

  const handleRemoveInstrument = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        topInstruments: formData.topInstruments.filter((_, i) => i !== index),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!formData && !data) {
    // Initialize with default data
    const defaultData: TransparencyData = {
      complianceStats: {
        maxLeverage: '10x',
        currentLeverage: '4.2x',
        maxDrawdown: '15%',
        observedDrawdown: '3.2%',
        avgSlippage: '0.12 pips',
        fillRate: '99.8%',
      },
      recentTrades: [],
      strategyPerformance: [],
      topInstruments: [],
      riskCompliance: {
        currentLeverage: '4.2x',
        leverageLimit: '10x',
        currentDD: '-1.4%',
        maxObservedDD: '-3.2%',
        slippageStats: '0.12 pips',
        maxSlippage: '0.8 pips',
        venues: 12,
        primeBrokers: 3,
      },
    };
    setFormData(defaultData);
  }

  const displayData = formData || data;

  if (!displayData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Transparency
          </h1>
          <p className="text-muted-foreground mt-2">Manage transparency and compliance data</p>
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

      {/* Compliance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Stats</CardTitle>
          <CardDescription>Configure compliance statistics</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Max Leverage</Label>
            <Input
              value={displayData.complianceStats.maxLeverage}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  complianceStats: { ...displayData.complianceStats, maxLeverage: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Current Leverage</Label>
            <Input
              value={displayData.complianceStats.currentLeverage}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  complianceStats: { ...displayData.complianceStats, currentLeverage: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Drawdown</Label>
            <Input
              value={displayData.complianceStats.maxDrawdown}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  complianceStats: { ...displayData.complianceStats, maxDrawdown: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Observed Drawdown</Label>
            <Input
              value={displayData.complianceStats.observedDrawdown}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  complianceStats: { ...displayData.complianceStats, observedDrawdown: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Avg Slippage</Label>
            <Input
              value={displayData.complianceStats.avgSlippage}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  complianceStats: { ...displayData.complianceStats, avgSlippage: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Fill Rate</Label>
            <Input
              value={displayData.complianceStats.fillRate}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  complianceStats: { ...displayData.complianceStats, fillRate: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Manage recent trade entries</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddTrade}>
              <Plus className="w-4 h-4 mr-2" />
              Add Trade
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayData.recentTrades.map((trade, index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-7 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  value={trade.time}
                  onChange={(e) => {
                    const updated = [...displayData.recentTrades];
                    updated[index] = { ...trade, time: e.target.value };
                    setFormData({ ...displayData, recentTrades: updated });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Instrument</Label>
                <Select
                  value={trade.instrument}
                  onValueChange={(value) => {
                    const updated = [...displayData.recentTrades];
                    updated[index] = { ...trade, instrument: value };
                    setFormData({ ...displayData, recentTrades: updated });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllSymbols().map((symbol) => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Strategy</Label>
                <Select
                  value={trade.strategy}
                  onValueChange={(value) => {
                    const updated = [...displayData.recentTrades];
                    updated[index] = { ...trade, strategy: value };
                    setFormData({ ...displayData, recentTrades: updated });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.name} value={strategy.name}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Direction</Label>
                <select
                  value={trade.direction}
                  onChange={(e) => {
                    const updated = [...displayData.recentTrades];
                    updated[index] = { ...trade, direction: e.target.value as 'buy' | 'sell' };
                    setFormData({ ...displayData, recentTrades: updated });
                  }}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Entry</Label>
                <Input
                  type="number"
                  value={trade.entry}
                  onChange={(e) => {
                    const updated = [...displayData.recentTrades];
                    updated[index] = { ...trade, entry: parseFloat(e.target.value) || 0 };
                    setFormData({ ...displayData, recentTrades: updated });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Input
                  value={trade.size}
                  onChange={(e) => {
                    const updated = [...displayData.recentTrades];
                    updated[index] = { ...trade, size: e.target.value };
                    setFormData({ ...displayData, recentTrades: updated });
                  }}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex-1 space-y-2">
                  <Label>Status</Label>
                  <Input
                    value={trade.status}
                    onChange={(e) => {
                      const updated = [...displayData.recentTrades];
                      updated[index] = { ...trade, status: e.target.value };
                      setFormData({ ...displayData, recentTrades: updated });
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTrade(index)}
                  className="ml-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strategy Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strategy Performance</CardTitle>
              <CardDescription>Manage strategy performance metrics</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddStrategy}>
              <Plus className="w-4 h-4 mr-2" />
              Add Strategy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayData.strategyPerformance.map((strategy, index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Name</Label>
                <Select
                  value={strategy.name}
                  onValueChange={(value) => {
                    const updated = [...displayData.strategyPerformance];
                    updated[index] = { ...strategy, name: value };
                    setFormData({ ...displayData, strategyPerformance: updated });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trades</Label>
                <Input
                  type="number"
                  value={strategy.trades}
                  onChange={(e) => {
                    const updated = [...displayData.strategyPerformance];
                    updated[index] = { ...strategy, trades: parseInt(e.target.value) || 0 };
                    setFormData({ ...displayData, strategyPerformance: updated });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Win Rate (%)</Label>
                <Input
                  type="number"
                  value={strategy.winRate}
                  onChange={(e) => {
                    const updated = [...displayData.strategyPerformance];
                    updated[index] = { ...strategy, winRate: parseFloat(e.target.value) || 0 };
                    setFormData({ ...displayData, strategyPerformance: updated });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Avg R</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={strategy.avgR}
                  onChange={(e) => {
                    const updated = [...displayData.strategyPerformance];
                    updated[index] = { ...strategy, avgR: parseFloat(e.target.value) || 0 };
                    setFormData({ ...displayData, strategyPerformance: updated });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>P&L</Label>
                <Input
                  type="number"
                  value={strategy.pnl}
                  onChange={(e) => {
                    const updated = [...displayData.strategyPerformance];
                    updated[index] = { ...strategy, pnl: parseFloat(e.target.value) || 0 };
                    setFormData({ ...displayData, strategyPerformance: updated });
                  }}
                />
              </div>
              <div className="space-y-2 flex items-end">
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
          ))}
        </CardContent>
      </Card>

      {/* Top Instruments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Instruments</CardTitle>
              <CardDescription>Manage top instrument metrics</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddInstrument}>
              <Plus className="w-4 h-4 mr-2" />
              Add Instrument
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayData.topInstruments.map((instrument, index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Symbol</Label>
                <Select
                  value={instrument.symbol}
                  onValueChange={(value) => {
                    const updated = [...displayData.topInstruments];
                    updated[index] = { ...instrument, symbol: value };
                    setFormData({ ...displayData, topInstruments: updated });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllSymbols().map((symbol) => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trades</Label>
                <Input
                  type="number"
                  value={instrument.trades}
                  onChange={(e) => {
                    const updated = [...displayData.topInstruments];
                    updated[index] = { ...instrument, trades: parseInt(e.target.value) || 0 };
                    setFormData({ ...displayData, topInstruments: updated });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Volume</Label>
                <Input
                  value={instrument.volume}
                  onChange={(e) => {
                    const updated = [...displayData.topInstruments];
                    updated[index] = { ...instrument, volume: e.target.value };
                    setFormData({ ...displayData, topInstruments: updated });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>P&L</Label>
                <Input
                  type="number"
                  value={instrument.pnl}
                  onChange={(e) => {
                    const updated = [...displayData.topInstruments];
                    updated[index] = { ...instrument, pnl: parseFloat(e.target.value) || 0 };
                    setFormData({ ...displayData, topInstruments: updated });
                  }}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveInstrument(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Risk & Compliance</CardTitle>
          <CardDescription>Configure risk and compliance metrics</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Current Leverage</Label>
            <Input
              value={displayData.riskCompliance.currentLeverage}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, currentLeverage: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Leverage Limit</Label>
            <Input
              value={displayData.riskCompliance.leverageLimit}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, leverageLimit: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Current DD</Label>
            <Input
              value={displayData.riskCompliance.currentDD}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, currentDD: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Observed DD</Label>
            <Input
              value={displayData.riskCompliance.maxObservedDD}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, maxObservedDD: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Slippage Stats</Label>
            <Input
              value={displayData.riskCompliance.slippageStats}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, slippageStats: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Slippage</Label>
            <Input
              value={displayData.riskCompliance.maxSlippage}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, maxSlippage: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Venues</Label>
            <Input
              type="number"
              value={displayData.riskCompliance.venues}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, venues: parseInt(e.target.value) || 0 },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Prime Brokers</Label>
            <Input
              type="number"
              value={displayData.riskCompliance.primeBrokers}
              onChange={(e) =>
                setFormData({
                  ...displayData,
                  riskCompliance: { ...displayData.riskCompliance, primeBrokers: parseInt(e.target.value) || 0 },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

