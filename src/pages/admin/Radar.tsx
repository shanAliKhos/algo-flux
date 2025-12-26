import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/GlassCard';
import { HeatmapGrid } from '@/components/ui/HeatmapGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MiniChart } from '@/components/ui/MiniChart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, Radar, Save, Plus, Trash2, Edit2, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AssetClass {
  label: string;
  value: number;
  sublabel: string;
}

interface Opportunity {
  symbol: string;
  price: string;
  change: number;
  strategy: string;
  signal: 'In Position' | 'Preparing Entry' | 'Watching';
}

interface Regime {
  name: string;
  description: string;
}

interface RadarData {
  assetClasses: AssetClass[];
  opportunities: Opportunity[];
  regimes: Regime[];
}

export default function Radar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Fetch Radar data
  const { data, isLoading, error } = useQuery({
    queryKey: ['radar-data'],
    queryFn: async (): Promise<RadarData> => {
      try {
        const response = await adminApi.getRadar();
        return response;
      } catch (error: any) {
        // If data doesn't exist yet, return empty structure
        if (error?.message?.includes('not found')) {
          return {
            assetClasses: [],
            opportunities: [],
            regimes: [],
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  // Local state for editing
  const [formData, setFormData] = useState<RadarData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: RadarData) => {
      return await adminApi.updateRadar(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radar-data'] });
      queryClient.refetchQueries({ queryKey: ['radar-data'] });
      toast({
        title: 'Success',
        description: 'Radar configuration updated successfully',
      });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update configuration',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (formData) {
      updateMutation.mutate(formData);
    }
  };

  const updateAssetClass = (index: number, field: keyof AssetClass, value: any) => {
    if (formData) {
      const updated = formData.assetClasses.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, assetClasses: updated });
    }
  };

  const addAssetClass = () => {
    if (formData) {
      setFormData({
        ...formData,
        assetClasses: [...formData.assetClasses, { label: 'New Asset', value: 0, sublabel: 'New' }],
      });
    }
  };

  const removeAssetClass = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        assetClasses: formData.assetClasses.filter((_, i) => i !== index),
      });
    }
  };

  const updateOpportunity = (index: number, field: keyof Opportunity, value: any) => {
    if (formData) {
      const updated = formData.opportunities.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, opportunities: updated });
    }
  };

  const addOpportunity = () => {
    if (formData) {
      setFormData({
        ...formData,
        opportunities: [
          ...formData.opportunities,
          {
            symbol: 'NEW',
            price: '0.00',
            change: 0,
            strategy: 'None',
            signal: 'Watching',
          },
        ],
      });
    }
  };

  const removeOpportunity = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        opportunities: formData.opportunities.filter((_, i) => i !== index),
      });
    }
  };

  const updateRegime = (index: number, field: keyof Regime, value: any) => {
    if (formData) {
      const updated = formData.regimes.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, regimes: updated });
    }
  };

  const addRegime = () => {
    if (formData) {
      setFormData({
        ...formData,
        regimes: [...formData.regimes, { name: 'New Regime', description: 'Description' }],
      });
    }
  };

  const removeRegime = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        regimes: formData.regimes.filter((_, i) => i !== index),
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
          <p className="text-destructive mb-2">Error loading Radar data</p>
          <p className="text-sm text-muted-foreground">Using default configuration</p>
        </div>
      </div>
    );
  }

  // Initialize form data
  const currentData = data || {
    assetClasses: [],
    opportunities: [],
    regimes: [],
  };

  const displayData = formData || currentData;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Radar className="w-10 h-10 text-primary" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold">
            Multi-Asset <span className="text-primary text-glow">Radar</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          How Algofi scans the entire market before placing any trade.
        </p>
      </div>

      {/* Asset Class Heatmap */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Asset Class Heatmap</CardTitle>
              <CardDescription>Manage asset class data for the heatmap</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'assetClasses' ? null : 'assetClasses');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'assetClasses' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'assetClasses' && formData ? (
            <div className="space-y-4">
              {formData.assetClasses.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateAssetClass(index, 'label', e.target.value)}
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Value (0-100)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.value}
                      onChange={(e) =>
                        updateAssetClass(index, 'value', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Sublabel</Label>
                    <Input
                      value={item.sublabel}
                      onChange={(e) => updateAssetClass(index, 'sublabel', e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeAssetClass(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl">Asset Class Heatmap</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4 text-primary animate-pulse" />
                  <span>Live scan</span>
                </div>
              </div>
              <HeatmapGrid cells={displayData.assetClasses} columns={3} />
            </div>
          )}
        </CardContent>
        {editingSection === 'assetClasses' && formData && (
          <CardFooter className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={addAssetClass}>
              <Plus className="w-4 h-4 mr-2" />
              Add Asset Class
            </Button>
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

      {/* Top Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Opportunities</CardTitle>
              <CardDescription>Manage trading opportunities</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'opportunities' ? null : 'opportunities');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'opportunities' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'opportunities' && formData ? (
            <div className="space-y-6">
              {formData.opportunities.map((opp, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Symbol</Label>
                        <Input
                          value={opp.symbol}
                          onChange={(e) => updateOpportunity(index, 'symbol', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          value={opp.price}
                          onChange={(e) => updateOpportunity(index, 'price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Change (%)</Label>
                        <Input
                          type="number"
                          value={opp.change}
                          onChange={(e) =>
                            updateOpportunity(index, 'change', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Strategy</Label>
                        <Input
                          value={opp.strategy}
                          onChange={(e) => updateOpportunity(index, 'strategy', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Signal</Label>
                        <Select
                          value={opp.signal}
                          onValueChange={(value) => updateOpportunity(index, 'signal', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In Position">In Position</SelectItem>
                            <SelectItem value="Preparing Entry">Preparing Entry</SelectItem>
                            <SelectItem value="Watching">Watching</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeOpportunity(index)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Symbol</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Price</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">24h</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Trend</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Strategy</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.opportunities.map((opp) => (
                    <tr key={opp.symbol} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-2 font-medium font-mono">{opp.symbol}</td>
                      <td className="py-4 px-2 font-mono text-muted-foreground">{opp.price}</td>
                      <td className="py-4 px-2">
                        <span className={opp.change >= 0 ? 'text-bullish' : 'text-bearish'}>
                          {opp.change >= 0 ? '+' : ''}
                          {opp.change}%
                        </span>
                      </td>
                      <td className="py-4 px-2 w-24">
                        <MiniChart
                          color={opp.change >= 0 ? 'bullish' : 'bearish'}
                          height={24}
                        />
                      </td>
                      <td className="py-4 px-2 text-sm text-muted-foreground">{opp.strategy}</td>
                      <td className="py-4 px-2">
                        <StatusBadge
                          status={
                            opp.signal === 'In Position'
                              ? 'active'
                              : opp.signal === 'Preparing Entry'
                                ? 'preparing'
                                : 'watching'
                          }
                          text={opp.signal}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {editingSection === 'opportunities' && formData && (
          <CardFooter className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={addOpportunity}>
              <Plus className="w-4 h-4 mr-2" />
              Add Opportunity
            </Button>
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

      {/* Regime Detection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regime Detection</CardTitle>
              <CardDescription>Manage market regime detections</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'regimes' ? null : 'regimes');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'regimes' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'regimes' && formData ? (
            <div className="space-y-4">
              {formData.regimes.map((regime, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={regime.name}
                        onChange={(e) => updateRegime(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={regime.description}
                        onChange={(e) => updateRegime(index, 'description', e.target.value)}
                      />
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeRegime(index)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-neutral" />
                <h3 className="font-display font-bold text-xl">Regime Detection</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {displayData.regimes.map((regime, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">{regime.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{regime.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'regimes' && formData && (
          <CardFooter className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={addRegime}>
              <Plus className="w-4 h-4 mr-2" />
              Add Regime
            </Button>
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

