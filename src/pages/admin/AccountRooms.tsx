import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, Plus, Trash2, Edit2, Users } from 'lucide-react';
import { adminApi, apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getAllSymbols } from '@/lib/trading-pairs';

interface AccountRoomsData {
  retailSmall: {
    title: string;
    subtitle: string;
    safeMode: {
      active: boolean;
      description: string;
    };
    dailyRiskUsed: number;
    maxDrawdown: number;
    currentDrawdown: number;
    leverageMode: string;
    recentSignals: Array<{
      emoji: string;
      text: string;
    }>;
    safetyReasons: string[];
  };
  proRetail: {
    title: string;
    subtitle: string;
    strategyUtilization: Array<{
      name: string;
      percentage: number;
    }>;
    executionQuality: number;
    marketRegime: {
      type: string;
      description: string;
    };
    opportunityHeatmap: Array<{
      symbol: string;
      active: boolean;
    }>;
    strategyConfidence: Array<{
      name: string;
      confidence: string;
    }>;
  };
  investor: {
    title: string;
    subtitle: string;
    equityCurve: {
      ytdReturn: number;
      dataPoints: number[];
    };
    drawdownZones: {
      maxDrawdown: number;
      currentDrawdown: number;
      avgRecovery: number;
    };
    riskAdjustedMetrics: {
      sharpeRatio: number;
      sortinoRatio: number;
      calmarRatio: number;
    };
    alphaSources: Array<{
      name: string;
      percentage: number;
    }>;
  };
  vipUltra: {
    title: string;
    subtitle: string;
    fullTransparency: {
      enabled: boolean;
      features: string[];
    };
    realTimeData: {
      enabled: boolean;
      latency: number;
    };
    advancedMetrics: {
      enabled: boolean;
      metrics: string[];
    };
    customReporting: {
      enabled: boolean;
      formats: string[];
    };
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

export default function AccountRoomsAdmin() {
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

  // Fetch Account Rooms data
  const { data, isLoading, error } = useQuery({
    queryKey: ['account-rooms'],
    queryFn: async (): Promise<AccountRoomsData> => {
      try {
        const response = await adminApi.getAccountRooms();
        return response;
      } catch (error: any) {
        // Return default data if API doesn't exist yet
        if (error?.message?.includes('not found')) {
          return {
            retailSmall: {
              title: 'Retail Small Account',
              subtitle: 'Safety-First Trading • $100–$3,000',
              safeMode: {
                active: true,
                description: 'All trades filtered through maximum safety protocols',
              },
              dailyRiskUsed: 35,
              maxDrawdown: -5,
              currentDrawdown: -1.2,
              leverageMode: 'Low: 1:10',
              recentSignals: [
                { emoji: '✅', text: 'XAUUSD buy closed +$45' },
                { emoji: '⏳', text: 'BTCUSDT watching...' },
                { emoji: '🛡️', text: 'Risk limit: OK' },
              ],
              safetyReasons: [
                'Low volatility environment',
                'Strong trend confirmation',
                'Risk only 0.5% of account',
                'Clear stop loss defined',
              ],
            },
            proRetail: {
              title: 'Pro Retail Account',
              subtitle: 'Advanced Control • $5,000–$50,000',
              strategyUtilization: [
                { name: 'Nuvex', percentage: 35 },
                { name: 'Drav', percentage: 28 },
                { name: 'Tenzor', percentage: 22 },
                { name: 'Others', percentage: 15 },
              ],
              executionQuality: 94.2,
              marketRegime: {
                type: 'Trending + Risk-On',
                description: 'Favoring momentum strategies',
              },
              opportunityHeatmap: [
                { symbol: 'XAUUSD', active: true },
                { symbol: 'BTCUSDT', active: true },
                { symbol: 'NAS100', active: true },
                { symbol: 'EURUSD', active: true },
                { symbol: 'TSLA', active: false },
                { symbol: 'AAPL', active: false },
                { symbol: 'ETH', active: false },
                { symbol: 'GBPJPY', active: false },
              ],
              strategyConfidence: [
                { name: 'Drav', confidence: 'High' },
                { name: 'Tenzor', confidence: 'High' },
                { name: 'Nuvex', confidence: 'Medium' },
              ],
            },
            investor: {
              title: 'Investor / Fund Account',
              subtitle: 'Institutional Reporting • $50,000–$1M+',
              equityCurve: {
                ytdReturn: 24.7,
                dataPoints: [45, 52, 48, 58, 55, 62, 68, 65, 72, 78, 75, 82],
              },
              drawdownZones: {
                maxDrawdown: -8.4,
                currentDrawdown: -2.1,
                avgRecovery: 12,
              },
              riskAdjustedMetrics: {
                sharpeRatio: 1.82,
                sortinoRatio: 2.14,
                calmarRatio: 2.94,
              },
              alphaSources: [
                { name: 'Momentum', percentage: 38 },
                { name: 'Mean Reversion', percentage: 28 },
                { name: 'SMC/Liquidity', percentage: 22 },
                { name: 'Statistical Arb', percentage: 12 },
              ],
            },
            vipUltra: {
              title: 'VIP Ultra Account',
              subtitle: 'Full Transparency • $1M+',
              fullTransparency: {
                enabled: true,
                features: ['Real-time trade execution', 'Full strategy disclosure', 'Live risk monitoring'],
              },
              realTimeData: {
                enabled: true,
                latency: 5,
              },
              advancedMetrics: {
                enabled: true,
                metrics: ['Sharpe Ratio', 'Sortino Ratio', 'Calmar Ratio', 'Max Drawdown'],
              },
              customReporting: {
                enabled: true,
                formats: ['PDF', 'Excel', 'JSON', 'CSV'],
              },
            },
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  // Local state for editing
  const [formData, setFormData] = useState<AccountRoomsData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: AccountRoomsData) => {
      // Ensure all active fields are proper booleans
      const cleanedConfig = {
        ...config,
        proRetail: {
          ...config.proRetail,
          opportunityHeatmap: config.proRetail.opportunityHeatmap.map(item => ({
            symbol: item.symbol,
            active: Boolean(item.active),
          })),
        },
      };
      return await adminApi.updateAccountRooms(cleanedConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-rooms'] });
      toast({
        title: 'Success',
        description: 'Account Rooms data updated successfully',
      });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update account rooms data',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (formData) {
      updateMutation.mutate(formData);
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
          <p className="text-destructive mb-2">Error loading Account Rooms data</p>
          <p className="text-sm text-muted-foreground">Using default configuration</p>
        </div>
      </div>
    );
  }

  const currentData = data || {
    retailSmall: {
      title: 'Retail Small Account',
      subtitle: 'Safety-First Trading • $100–$3,000',
      safeMode: { active: true, description: '' },
      dailyRiskUsed: 0,
      maxDrawdown: 0,
      currentDrawdown: 0,
      leverageMode: '',
      recentSignals: [],
      safetyReasons: [],
    },
    proRetail: {
      title: 'Pro Retail Account',
      subtitle: 'Advanced Control • $5,000–$50,000',
      strategyUtilization: [],
      executionQuality: 0,
      marketRegime: { type: '', description: '' },
      opportunityHeatmap: [],
      strategyConfidence: [],
    },
    investor: {
      title: 'Investor / Fund Account',
      subtitle: 'Institutional Reporting • $50,000–$1M+',
      equityCurve: { ytdReturn: 0, dataPoints: [] },
      drawdownZones: { maxDrawdown: 0, currentDrawdown: 0, avgRecovery: 0 },
      riskAdjustedMetrics: { sharpeRatio: 0, sortinoRatio: 0, calmarRatio: 0 },
      alphaSources: [],
    },
    vipUltra: {
      title: 'VIP Ultra Account',
      subtitle: 'Full Transparency • $1M+',
      fullTransparency: { enabled: false, features: [] },
      realTimeData: { enabled: false, latency: 0 },
      advancedMetrics: { enabled: false, metrics: [] },
      customReporting: { enabled: false, formats: [] },
    },
  };

  const displayData = formData || currentData;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Users className="w-10 h-10 text-primary" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold">
            Account Rooms <span className="text-primary text-glow">Management</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage and configure account room settings for different account types
        </p>
      </div>

      {/* Retail Small Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Retail Small Account</CardTitle>
              <CardDescription>Configure settings for retail small accounts ($100–$3,000)</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'retail-small' ? null : 'retail-small');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'retail-small' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'retail-small' && formData ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.retailSmall.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        retailSmall: { ...formData.retailSmall, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.retailSmall.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        retailSmall: { ...formData.retailSmall, subtitle: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.retailSmall.safeMode.active}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        retailSmall: {
                          ...formData.retailSmall,
                          safeMode: { ...formData.retailSmall.safeMode, active: checked as boolean },
                        },
                      })
                    }
                  />
                  <Label>Safe Mode Active</Label>
                </div>
                <div className="space-y-2">
                  <Label>Safe Mode Description</Label>
                  <Input
                    value={formData.retailSmall.safeMode.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        retailSmall: {
                          ...formData.retailSmall,
                          safeMode: { ...formData.retailSmall.safeMode, description: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Daily Risk Used (%)</Label>
                  <Input
                    type="number"
                    value={formData.retailSmall.dailyRiskUsed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        retailSmall: { ...formData.retailSmall, dailyRiskUsed: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={formData.retailSmall.maxDrawdown}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        retailSmall: { ...formData.retailSmall, maxDrawdown: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={formData.retailSmall.currentDrawdown}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        retailSmall: { ...formData.retailSmall, currentDrawdown: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Leverage Mode</Label>
                <Input
                  value={formData.retailSmall.leverageMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      retailSmall: { ...formData.retailSmall, leverageMode: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Recent Signals</Label>
                {formData.retailSmall.recentSignals.map((signal, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Emoji"
                      value={signal.emoji}
                      onChange={(e) => {
                        const updated = [...formData.retailSmall.recentSignals];
                        updated[index] = { ...signal, emoji: e.target.value };
                        setFormData({
                          ...formData,
                          retailSmall: { ...formData.retailSmall, recentSignals: updated },
                        });
                      }}
                      className="w-20"
                    />
                    <Input
                      placeholder="Text"
                      value={signal.text}
                      onChange={(e) => {
                        const updated = [...formData.retailSmall.recentSignals];
                        updated[index] = { ...signal, text: e.target.value };
                        setFormData({
                          ...formData,
                          retailSmall: { ...formData.retailSmall, recentSignals: updated },
                        });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = formData.retailSmall.recentSignals.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          retailSmall: { ...formData.retailSmall, recentSignals: updated },
                        });
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
                    setFormData({
                      ...formData,
                      retailSmall: {
                        ...formData.retailSmall,
                        recentSignals: [...formData.retailSmall.recentSignals, { emoji: '', text: '' }],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Signal
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Safety Reasons</Label>
                {formData.retailSmall.safetyReasons.map((reason, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={reason}
                      onChange={(e) => {
                        const updated = [...formData.retailSmall.safetyReasons];
                        updated[index] = e.target.value;
                        setFormData({
                          ...formData,
                          retailSmall: { ...formData.retailSmall, safetyReasons: updated },
                        });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = formData.retailSmall.safetyReasons.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          retailSmall: { ...formData.retailSmall, safetyReasons: updated },
                        });
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
                    setFormData({
                      ...formData,
                      retailSmall: {
                        ...formData.retailSmall,
                        safetyReasons: [...formData.retailSmall.safetyReasons, ''],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reason
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-semibold">{displayData.retailSmall.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subtitle</p>
                <p className="font-semibold">{displayData.retailSmall.subtitle}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Risk Used</p>
                  <p className="text-2xl font-bold text-primary">{displayData.retailSmall.dailyRiskUsed}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="text-2xl font-bold text-destructive">{displayData.retailSmall.maxDrawdown}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Drawdown</p>
                  <p className="text-2xl font-bold text-warning">{displayData.retailSmall.currentDrawdown}%</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'retail-small' && formData && (
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

      {/* Pro Retail Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pro Retail Account</CardTitle>
              <CardDescription>Configure settings for pro retail accounts ($5,000–$50,000)</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'pro-retail' ? null : 'pro-retail');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'pro-retail' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'pro-retail' && formData ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.proRetail.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proRetail: { ...formData.proRetail, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.proRetail.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proRetail: { ...formData.proRetail, subtitle: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Execution Quality</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.proRetail.executionQuality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proRetail: { ...formData.proRetail, executionQuality: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Market Regime Type</Label>
                  <Input
                    value={formData.proRetail.marketRegime.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proRetail: {
                          ...formData.proRetail,
                          marketRegime: { ...formData.proRetail.marketRegime, type: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Market Regime Description</Label>
                  <Input
                    value={formData.proRetail.marketRegime.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proRetail: {
                          ...formData.proRetail,
                          marketRegime: { ...formData.proRetail.marketRegime, description: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Strategy Utilization</Label>
                {formData.proRetail.strategyUtilization.map((strategy, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      value={strategy.name}
                      onValueChange={(value) => {
                        const updated = [...formData.proRetail.strategyUtilization];
                        updated[index] = { ...strategy, name: value };
                        setFormData({
                          ...formData,
                          proRetail: { ...formData.proRetail, strategyUtilization: updated },
                        });
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
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
                    <Input
                      type="number"
                      placeholder="Percentage"
                      value={strategy.percentage}
                      onChange={(e) => {
                        const updated = [...formData.proRetail.strategyUtilization];
                        updated[index] = { ...strategy, percentage: parseFloat(e.target.value) || 0 };
                        setFormData({
                          ...formData,
                          proRetail: { ...formData.proRetail, strategyUtilization: updated },
                        });
                      }}
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = formData.proRetail.strategyUtilization.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          proRetail: { ...formData.proRetail, strategyUtilization: updated },
                        });
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
                    setFormData({
                      ...formData,
                      proRetail: {
                        ...formData.proRetail,
                        strategyUtilization: [...formData.proRetail.strategyUtilization, { name: '', percentage: 0 }],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Strategy
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Opportunity Heatmap</Label>
                {formData.proRetail.opportunityHeatmap.map((item, index) => {
                  const availableSymbols = getAllSymbols();
                  const usedSymbols = formData.proRetail.opportunityHeatmap.map(h => h.symbol).filter((s, i) => i !== index);
                  const availableOptions = availableSymbols.filter(s => !usedSymbols.includes(s) || s === item.symbol);
                  
                  return (
                    <div key={index} className="flex gap-2">
                      <Select
                        value={item.symbol}
                        onValueChange={(value) => {
                          const updated = [...formData.proRetail.opportunityHeatmap];
                          updated[index] = { ...item, symbol: value };
                          setFormData({
                            ...formData,
                            proRetail: { ...formData.proRetail, opportunityHeatmap: updated },
                          });
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select symbol" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableOptions.map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                              {symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={item.active}
                          onCheckedChange={(checked) => {
                            const updated = [...formData.proRetail.opportunityHeatmap];
                            updated[index] = { ...item, active: checked as boolean };
                            setFormData({
                              ...formData,
                              proRetail: { ...formData.proRetail, opportunityHeatmap: updated },
                            });
                          }}
                        />
                        <Label className="text-xs">Active</Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = formData.proRetail.opportunityHeatmap.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            proRetail: { ...formData.proRetail, opportunityHeatmap: updated },
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const availableSymbols = getAllSymbols();
                    const usedSymbols = formData.proRetail.opportunityHeatmap.map(h => h.symbol);
                    const nextAvailableSymbol = availableSymbols.find(s => !usedSymbols.includes(s)) || '';
                    
                    setFormData({
                      ...formData,
                      proRetail: {
                        ...formData.proRetail,
                        opportunityHeatmap: [...formData.proRetail.opportunityHeatmap, { symbol: nextAvailableSymbol, active: false }],
                      },
                    });
                  }}
                  disabled={formData.proRetail.opportunityHeatmap.length >= getAllSymbols().length}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Symbol
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Strategy Confidence</Label>
                {formData.proRetail.strategyConfidence.map((confidence, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      value={confidence.name}
                      onValueChange={(value) => {
                        const updated = [...formData.proRetail.strategyConfidence];
                        updated[index] = { ...confidence, name: value };
                        setFormData({
                          ...formData,
                          proRetail: { ...formData.proRetail, strategyConfidence: updated },
                        });
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
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
                    <Select
                      value={confidence.confidence}
                      onValueChange={(value) => {
                        const updated = [...formData.proRetail.strategyConfidence];
                        updated[index] = { ...confidence, confidence: value };
                        setFormData({
                          ...formData,
                          proRetail: { ...formData.proRetail, strategyConfidence: updated },
                        });
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select confidence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = formData.proRetail.strategyConfidence.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          proRetail: { ...formData.proRetail, strategyConfidence: updated },
                        });
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
                    setFormData({
                      ...formData,
                      proRetail: {
                        ...formData.proRetail,
                        strategyConfidence: [...formData.proRetail.strategyConfidence, { name: '', confidence: '' }],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Strategy Confidence
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-semibold">{displayData.proRetail.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Execution Quality</p>
                <p className="text-2xl font-bold text-primary">{displayData.proRetail.executionQuality}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Opportunity Heatmap</p>
                <div className="grid grid-cols-4 gap-2">
                  {displayData.proRetail.opportunityHeatmap.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-2 rounded text-center text-xs',
                        item.active
                          ? 'bg-primary/30 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {item.symbol}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Strategy Confidence</p>
                <div className="space-y-1">
                  {displayData.proRetail.strategyConfidence.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className={cn(
                        item.confidence === 'High' ? 'text-primary' : 
                        item.confidence === 'Medium' ? 'text-warning' : 'text-muted-foreground'
                      )}>
                        {item.confidence}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'pro-retail' && formData && (
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

      {/* Investor Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Investor / Fund Account</CardTitle>
              <CardDescription>Configure settings for investor accounts ($50,000–$1M+)</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'investor' ? null : 'investor');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'investor' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'investor' && formData ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.investor.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investor: { ...formData.investor, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.investor.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investor: { ...formData.investor, subtitle: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>YTD Return (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.investor.equityCurve.ytdReturn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      investor: {
                        ...formData.investor,
                        equityCurve: { ...formData.investor.equityCurve, ytdReturn: parseFloat(e.target.value) || 0 },
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Chart Data Points (Equity Curve - values 0-100)</Label>
                <div className="space-y-2">
                  {formData.investor.equityCurve.dataPoints.map((point, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground w-8">#{index + 1}</span>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={point}
                        onChange={(e) => {
                          const updated = [...formData.investor.equityCurve.dataPoints];
                          updated[index] = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            investor: {
                              ...formData.investor,
                              equityCurve: { ...formData.investor.equityCurve, dataPoints: updated },
                            },
                          });
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = formData.investor.equityCurve.dataPoints.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            investor: {
                              ...formData.investor,
                              equityCurve: { ...formData.investor.equityCurve, dataPoints: updated },
                            },
                          });
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
                      setFormData({
                        ...formData,
                        investor: {
                          ...formData.investor,
                          equityCurve: {
                            ...formData.investor.equityCurve,
                            dataPoints: [...formData.investor.equityCurve.dataPoints, 50],
                          },
                        },
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Data Point
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  These values represent the height percentage (0-100) for each bar in the equity curve chart
                </p>
              </div>
              
              {/* Drawdown Zones Section */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Drawdown Zones</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Configure drawdown metrics for risk assessment
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Max Drawdown (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.investor.drawdownZones.maxDrawdown}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investor: {
                            ...formData.investor,
                            drawdownZones: {
                              ...formData.investor.drawdownZones,
                              maxDrawdown: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Maximum historical drawdown (negative value)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Drawdown (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.investor.drawdownZones.currentDrawdown}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investor: {
                            ...formData.investor,
                            drawdownZones: {
                              ...formData.investor.drawdownZones,
                              currentDrawdown: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Current drawdown from peak (negative value)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Avg Recovery (days)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.investor.drawdownZones.avgRecovery}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investor: {
                            ...formData.investor,
                            drawdownZones: {
                              ...formData.investor.drawdownZones,
                              avgRecovery: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Average days to recover from drawdown</p>
                  </div>
              </div>
              </div>
              
              {/* Risk-Adjusted Metrics Section */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Risk-Adjusted Metrics</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Configure risk-adjusted performance ratios
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Sharpe Ratio</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.investor.riskAdjustedMetrics.sharpeRatio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investor: {
                            ...formData.investor,
                            riskAdjustedMetrics: {
                              ...formData.investor.riskAdjustedMetrics,
                              sharpeRatio: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Risk-adjusted return measure (higher is better)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Sortino Ratio</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.investor.riskAdjustedMetrics.sortinoRatio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investor: {
                            ...formData.investor,
                            riskAdjustedMetrics: {
                              ...formData.investor.riskAdjustedMetrics,
                              sortinoRatio: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Downside risk-adjusted return (higher is better)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Calmar Ratio</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.investor.riskAdjustedMetrics.calmarRatio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investor: {
                            ...formData.investor,
                            riskAdjustedMetrics: {
                              ...formData.investor.riskAdjustedMetrics,
                              calmarRatio: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Return to max drawdown ratio (higher is better)</p>
                  </div>
              </div>
              </div>
              
              {/* Alpha Sources Section */}
              <div className="space-y-2 border-t pt-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Alpha Sources</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Configure alpha source contributions (percentages should total 100%)
                  </p>
                </div>
                <Label>Alpha Sources</Label>
                {formData.investor.alphaSources.map((source, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      value={source.name}
                      onValueChange={(value) => {
                        const updated = [...formData.investor.alphaSources];
                        updated[index] = { ...source, name: value };
                        setFormData({
                          ...formData,
                          investor: { ...formData.investor, alphaSources: updated },
                        });
                      }}
                    >
                      <SelectTrigger className="flex-1">
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
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="Percentage"
                      value={source.percentage}
                      onChange={(e) => {
                        const updated = [...formData.investor.alphaSources];
                        updated[index] = { ...source, percentage: parseFloat(e.target.value) || 0 };
                        setFormData({
                          ...formData,
                          investor: { ...formData.investor, alphaSources: updated },
                        });
                      }}
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = formData.investor.alphaSources.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          investor: { ...formData.investor, alphaSources: updated },
                        });
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
                    setFormData({
                      ...formData,
                      investor: {
                        ...formData.investor,
                        alphaSources: [...formData.investor.alphaSources, { name: '', percentage: 0 }],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Alpha Source
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-semibold">{displayData.investor.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">YTD Return</p>
                <p className="text-2xl font-bold text-primary">+{displayData.investor.equityCurve.ytdReturn}%</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Drawdown Zones</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Max DD</span>
                      <span className="text-destructive">{displayData.investor.drawdownZones.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current DD</span>
                      <span className="text-warning">{displayData.investor.drawdownZones.currentDrawdown}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Recovery</span>
                      <span className="text-primary">{displayData.investor.drawdownZones.avgRecovery} days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Risk-Adjusted Metrics</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sharpe Ratio</span>
                      <span className="text-primary">{displayData.investor.riskAdjustedMetrics.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sortino Ratio</span>
                      <span className="text-primary">{displayData.investor.riskAdjustedMetrics.sortinoRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Calmar Ratio</span>
                      <span className="text-primary">{displayData.investor.riskAdjustedMetrics.calmarRatio.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Chart Data Points</p>
                <p className="text-xs text-muted-foreground">
                  {displayData.investor.equityCurve.dataPoints.length} data points configured
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Alpha Sources</p>
                <div className="space-y-1">
                  {displayData.investor.alphaSources.map((source, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{source.name}</span>
                      <span className="text-primary">{source.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'investor' && formData && (
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

      {/* VIP Ultra Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>VIP Ultra Account</CardTitle>
              <CardDescription>Configure settings for VIP ultra accounts ($1M+)</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'vip-ultra' ? null : 'vip-ultra');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'vip-ultra' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'vip-ultra' && formData ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.vipUltra.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vipUltra: { ...formData.vipUltra, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.vipUltra.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vipUltra: { ...formData.vipUltra, subtitle: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.vipUltra.fullTransparency.enabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        vipUltra: {
                          ...formData.vipUltra,
                          fullTransparency: { ...formData.vipUltra.fullTransparency, enabled: checked as boolean },
                        },
                      })
                    }
                  />
                  <Label>Full Transparency Enabled</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.vipUltra.realTimeData.enabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        vipUltra: {
                          ...formData.vipUltra,
                          realTimeData: { ...formData.vipUltra.realTimeData, enabled: checked as boolean },
                        },
                      })
                    }
                  />
                  <Label>Real-Time Data Enabled</Label>
                </div>
                <div className="space-y-2">
                  <Label>Latency (ms)</Label>
                  <Input
                    type="number"
                    value={formData.vipUltra.realTimeData.latency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vipUltra: {
                          ...formData.vipUltra,
                          realTimeData: { ...formData.vipUltra.realTimeData, latency: parseFloat(e.target.value) || 0 },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-semibold">{displayData.vipUltra.title}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Full Transparency</p>
                  <p className="font-semibold">{displayData.vipUltra.fullTransparency.enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Real-Time Data</p>
                  <p className="font-semibold">{displayData.vipUltra.realTimeData.enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'vip-ultra' && formData && (
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

