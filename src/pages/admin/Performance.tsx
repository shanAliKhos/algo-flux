import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, Save, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { adminApi, apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { RiskMetricsCards } from '@/components/ui/PerformanceCharts';

interface RiskMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  totalTrades: number;
}

interface YearlyPerformance {
  year: number;
  return: number;
  trades: number;
  winRate: number;
}

interface EquityCurvePoint {
  date: string;
  equity: number;
  drawdown: number;
}

interface StrategyContribution {
  strategy: string;
  return: number;
  trades: number;
  winRate: number;
  sharpeRatio: number;
}

interface DrawdownHistoryPoint {
  date: string;
  drawdown: number;
  recovery: number;
}

interface DrawdownData {
  maxDrawdown: number;
  maxDrawdownDate: string;
  currentDrawdown: number;
  recoveryTime: number;
  drawdownHistory: DrawdownHistoryPoint[];
}

interface PerformanceData {
  riskMetrics: RiskMetrics;
  yearlyPerformance: YearlyPerformance[];
  equityCurve: EquityCurvePoint[];
  strategyContributions: StrategyContribution[];
  drawdownData: DrawdownData;
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

export default function Performance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);

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

  // Fetch Performance data
  const { data, isLoading, error } = useQuery({
    queryKey: ['performance-data'],
    queryFn: async (): Promise<PerformanceData> => {
      try {
        const response = await adminApi.getPerformance();
        return response;
      } catch (error: any) {
        // Return default data if API doesn't exist yet
        if (error?.message?.includes('not found')) {
          return {
            riskMetrics: {
              sharpeRatio: 2.84,
              sortinoRatio: 3.12,
              maxDrawdown: -12.5,
              winRate: 68.5,
              profitFactor: 2.1,
              averageWin: 1250,
              averageLoss: -580,
              totalTrades: 1247,
            },
            yearlyPerformance: [
              { year: 2021, return: 42, trades: 312, winRate: 65 },
              { year: 2022, return: 38, trades: 298, winRate: 68 },
              { year: 2023, return: 57, trades: 345, winRate: 72 },
              { year: 2024, return: 35, trades: 292, winRate: 69 },
            ],
            equityCurve: [],
            strategyContributions: [],
            drawdownData: {
              maxDrawdown: -12.5,
              maxDrawdownDate: '2023-03-15',
              currentDrawdown: -3.2,
              recoveryTime: 45,
              drawdownHistory: [],
            },
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  // Local state for editing
  const [formData, setFormData] = useState<PerformanceData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: PerformanceData) => {
      return await adminApi.updatePerformance(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-data'] });
      toast({
        title: 'Success',
        description: 'Performance data updated successfully',
      });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update performance data',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (formData) {
      updateMutation.mutate(formData);
    }
  };

  const updateRiskMetrics = (field: keyof RiskMetrics, value: number) => {
    if (formData) {
      setFormData({
        ...formData,
        riskMetrics: { ...formData.riskMetrics, [field]: value },
      });
    }
  };

  const updateYearlyPerformance = (index: number, field: keyof YearlyPerformance, value: any) => {
    if (formData) {
      const updated = formData.yearlyPerformance.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, yearlyPerformance: updated });
    }
  };

  const addYearlyPerformance = () => {
    if (formData) {
      setFormData({
        ...formData,
        yearlyPerformance: [
          ...formData.yearlyPerformance,
          { year: new Date().getFullYear(), return: 0, trades: 0, winRate: 0 },
        ],
      });
    }
  };

  const removeYearlyPerformance = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        yearlyPerformance: formData.yearlyPerformance.filter((_, i) => i !== index),
      });
    }
  };

  const updateEquityCurve = (index: number, field: keyof EquityCurvePoint, value: any) => {
    if (formData) {
      const updated = formData.equityCurve.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, equityCurve: updated });
    }
  };

  const addEquityCurve = () => {
    if (formData) {
      // Calculate next date (monthly intervals)
      const lastDate = formData.equityCurve.length > 0 
        ? new Date(formData.equityCurve[formData.equityCurve.length - 1].date)
        : new Date('2021-01-01');
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      // Calculate next equity (slight growth from last or start at 100000)
      const lastEquity = formData.equityCurve.length > 0 
        ? formData.equityCurve[formData.equityCurve.length - 1].equity
        : 100000;
      const nextEquity = lastEquity * 1.035; // ~3.5% growth
      
      setFormData({
        ...formData,
        equityCurve: [
          ...formData.equityCurve,
          { date: nextDate.toISOString().split('T')[0], equity: nextEquity, drawdown: 0 },
        ],
      });
    }
  };

  const removeEquityCurve = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        equityCurve: formData.equityCurve.filter((_, i) => i !== index),
      });
    }
  };

  const updateStrategyContribution = (index: number, field: keyof StrategyContribution, value: any) => {
    if (formData) {
      const updated = formData.strategyContributions.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, strategyContributions: updated });
    }
  };

  const addStrategyContribution = () => {
    if (formData) {
      setFormData({
        ...formData,
        strategyContributions: [
          ...formData.strategyContributions,
          { strategy: 'New Strategy', return: 0, trades: 0, winRate: 0, sharpeRatio: 0 },
        ],
      });
    }
  };

  const removeStrategyContribution = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        strategyContributions: formData.strategyContributions.filter((_, i) => i !== index),
      });
    }
  };

  const updateDrawdownData = (field: keyof DrawdownData, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        drawdownData: { ...formData.drawdownData, [field]: value },
      });
    }
  };

  const updateDrawdownHistory = (index: number, field: keyof DrawdownHistoryPoint, value: any) => {
    if (formData) {
      const updated = formData.drawdownData.drawdownHistory.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({
        ...formData,
        drawdownData: { ...formData.drawdownData, drawdownHistory: updated },
      });
    }
  };

  const addDrawdownHistory = () => {
    if (formData) {
      const nextIndex = formData.drawdownData.drawdownHistory.length;
      const quarter = (nextIndex % 4) + 1;
      const year = Math.floor(nextIndex / 4) + 1;
      setFormData({
        ...formData,
        drawdownData: {
          ...formData.drawdownData,
          drawdownHistory: [
            ...formData.drawdownData.drawdownHistory,
            { date: `Q${quarter} Y${year}`, drawdown: 0, recovery: 0 },
          ],
        },
      });
    }
  };

  const removeDrawdownHistory = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        drawdownData: {
          ...formData.drawdownData,
          drawdownHistory: formData.drawdownData.drawdownHistory.filter((_, i) => i !== index),
        },
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading Performance data</p>
          <p className="text-sm text-muted-foreground">Using default configuration</p>
        </div>
      </div>
    );
  }

  const currentData = data || {
    riskMetrics: {
      sharpeRatio: 2.84,
      sortinoRatio: 3.12,
      maxDrawdown: -12.5,
      winRate: 68.5,
      profitFactor: 2.1,
      averageWin: 1250,
      averageLoss: -580,
      totalTrades: 1247,
    },
    yearlyPerformance: [],
    equityCurve: [],
    strategyContributions: [],
    drawdownData: {
      maxDrawdown: -12.5,
      maxDrawdownDate: '2023-03-15',
      currentDrawdown: -3.2,
      recoveryTime: 45,
      drawdownHistory: [],
    },
  };

  const displayData = formData || currentData;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <TrendingUp className="w-10 h-10 text-primary" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold">
            Performance <span className="text-primary text-glow">Management</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage and configure performance metrics and historical data
        </p>
      </div>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Metrics</CardTitle>
              <CardDescription>Configure key risk and performance metrics</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'risk' ? null : 'risk');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'risk' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'risk' && formData ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Sharpe Ratio */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-center">
                <Label className="text-xs text-muted-foreground">Sharpe Ratio</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="text-2xl font-display font-bold text-primary h-auto py-1 text-center border-primary/20 focus:border-primary"
                  value={formData.riskMetrics.sharpeRatio}
                  onChange={(e) => updateRiskMetrics('sharpeRatio', parseFloat(e.target.value) || 0)}
                />
              </div>
              {/* Sortino Ratio */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-center">
                <Label className="text-xs text-muted-foreground">Sortino Ratio</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="text-2xl font-display font-bold text-primary h-auto py-1 text-center border-primary/20 focus:border-primary"
                  value={formData.riskMetrics.sortinoRatio}
                  onChange={(e) => updateRiskMetrics('sortinoRatio', parseFloat(e.target.value) || 0)}
                />
              </div>
              {/* Win Rate */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-center">
                <Label className="text-xs text-muted-foreground">Win Rate</Label>
                <Input
                  type="number"
                  step="0.1"
                  className="text-2xl font-display font-bold text-primary h-auto py-1 text-center border-primary/20 focus:border-primary"
                  value={formData.riskMetrics.winRate}
                  onChange={(e) => updateRiskMetrics('winRate', parseFloat(e.target.value) || 0)}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              {/* Average R:R */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-center">
                <Label className="text-xs text-muted-foreground">Average R:R</Label>
                <div className="text-2xl font-display font-bold text-primary mb-2">
                  1:{(Math.abs(formData.riskMetrics.averageWin) / Math.abs(formData.riskMetrics.averageLoss || 1)).toFixed(1)}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Win ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="h-8 text-sm"
                      value={formData.riskMetrics.averageWin}
                      onChange={(e) => updateRiskMetrics('averageWin', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Loss ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="h-8 text-sm"
                      value={formData.riskMetrics.averageLoss}
                      onChange={(e) => updateRiskMetrics('averageLoss', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              {/* Profit Consistency */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-center">
                <Label className="text-xs text-muted-foreground">Profit Consistency</Label>
                <div className="text-2xl font-display font-bold text-primary mb-2">
                  {formData.riskMetrics.winRate.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  (Same as Win Rate - % of profitable trades)
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Total Trades</Label>
                  <Input
                    type="number"
                    className="h-8 text-sm"
                    value={formData.riskMetrics.totalTrades}
                    onChange={(e) => updateRiskMetrics('totalTrades', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <RiskMetricsCards riskMetrics={displayData.riskMetrics} />
          )}
        </CardContent>
        {editingSection === 'risk' && formData && (
          <CardFooter>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Yearly Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Yearly Performance</CardTitle>
              <CardDescription>Manage yearly performance data</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'yearly' ? null : 'yearly');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'yearly' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'yearly' && formData ? (
            <div className="space-y-4">
              {formData.yearlyPerformance.map((item, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={item.year}
                      onChange={(e) => updateYearlyPerformance(index, 'year', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Return (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={item.return}
                      onChange={(e) => updateYearlyPerformance(index, 'return', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trades</Label>
                    <Input
                      type="number"
                      value={item.trades}
                      onChange={(e) => updateYearlyPerformance(index, 'trades', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Win Rate (%)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={item.winRate}
                        onChange={(e) => updateYearlyPerformance(index, 'winRate', parseFloat(e.target.value) || 0)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeYearlyPerformance(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addYearlyPerformance}>
                <Plus className="w-4 h-4 mr-2" />
                Add Year
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.yearlyPerformance.length > 0 ? (
                displayData.yearlyPerformance.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.year}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.trades} trades • {item.winRate.toFixed(1)}% win rate
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-primary">+{item.return}%</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No yearly performance data</p>
              )}
            </div>
          )}
        </CardContent>
        {editingSection === 'yearly' && formData && (
          <CardFooter>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Equity Curve */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>Manage equity curve data points</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'equity' ? null : 'equity');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'equity' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'equity' && formData ? (
            <div className="space-y-4">
              {formData.equityCurve.map((item, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={item.date}
                      onChange={(e) => updateEquityCurve(index, 'date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Equity ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.equity}
                      onChange={(e) => updateEquityCurve(index, 'equity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Drawdown (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={item.drawdown}
                      onChange={(e) => updateEquityCurve(index, 'drawdown', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="ghost" size="icon" onClick={() => removeEquityCurve(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addEquityCurve}>
                <Plus className="w-4 h-4 mr-2" />
                Add Data Point
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.equityCurve.length > 0 ? (
                <div className="grid gap-2 md:grid-cols-4">
                  {displayData.equityCurve.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                      <p className="text-lg font-semibold">${item.equity.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.drawdown.toFixed(1)}% drawdown</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No equity curve data</p>
              )}
            </div>
          )}
        </CardContent>
        {editingSection === 'equity' && formData && (
          <CardFooter>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Strategy Contributions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strategy Contributions</CardTitle>
              <CardDescription>Manage strategy performance contributions</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'strategies' ? null : 'strategies');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'strategies' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'strategies' && formData ? (
            <div className="space-y-4">
              {formData.strategyContributions.map((item, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-5 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Strategy</Label>
                    <Select
                      value={item.strategy}
                      onValueChange={(value) => updateStrategyContribution(index, 'strategy', value)}
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
                    <Label>Return (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={item.return}
                      onChange={(e) => updateStrategyContribution(index, 'return', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trades</Label>
                    <Input
                      type="number"
                      value={item.trades}
                      onChange={(e) => updateStrategyContribution(index, 'trades', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Win Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={item.winRate}
                      onChange={(e) => updateStrategyContribution(index, 'winRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sharpe Ratio</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.sharpeRatio}
                        onChange={(e) => updateStrategyContribution(index, 'sharpeRatio', parseFloat(e.target.value) || 0)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeStrategyContribution(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addStrategyContribution}>
                <Plus className="w-4 h-4 mr-2" />
                Add Strategy
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.strategyContributions.length > 0 ? (
                displayData.strategyContributions.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.strategy}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.trades} trades • {item.winRate.toFixed(1)}% win rate • Sharpe: {item.sharpeRatio.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-primary">+{item.return}%</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No strategy contributions data</p>
              )}
            </div>
          )}
        </CardContent>
        {editingSection === 'strategies' && formData && (
          <CardFooter>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Drawdown Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Drawdown Analysis</CardTitle>
              <CardDescription>Manage drawdown periods for the chart</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'drawdown' ? null : 'drawdown');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'drawdown' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'drawdown' && formData ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.drawdownData.maxDrawdown}
                    onChange={(e) => updateDrawdownData('maxDrawdown', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recovery Time (days)</Label>
                  <Input
                    type="number"
                    value={formData.drawdownData.recoveryTime}
                    onChange={(e) => updateDrawdownData('recoveryTime', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Drawdown History (for chart periods)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Each entry represents a period (Q1 Y1, Q2 Y1, etc.) shown in the chart
                </p>
                {formData.drawdownData.drawdownHistory.map((item, index) => (
                  <div key={index} className="grid gap-2 md:grid-cols-4 p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-xs">Period Label</Label>
                      <Input
                        placeholder="Q1 Y1"
                        value={item.date}
                        onChange={(e) => updateDrawdownHistory(index, 'date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Drawdown (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={item.drawdown}
                        onChange={(e) => updateDrawdownHistory(index, 'drawdown', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Recovery (days)</Label>
                      <Input
                        type="number"
                        step="1"
                        value={item.recovery || 0}
                        onChange={(e) => updateDrawdownHistory(index, 'recovery', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="ghost" size="icon" onClick={() => removeDrawdownHistory(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addDrawdownHistory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Period
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="text-2xl font-bold">{displayData.drawdownData.maxDrawdown.toFixed(2)}%</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Recovery Time</p>
                  <p className="text-2xl font-bold">{displayData.drawdownData.recoveryTime} days</p>
                </div>
              </div>
              {displayData.drawdownData.drawdownHistory.length > 0 && (
                <div className="space-y-2">
                  <Label>Chart Periods ({displayData.drawdownData.drawdownHistory.length} entries)</Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {displayData.drawdownData.drawdownHistory.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                        <p className="text-lg font-semibold">{item.drawdown.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">{item.recovery} days recovery</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {editingSection === 'drawdown' && formData && (
          <CardFooter>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

