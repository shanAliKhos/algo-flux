import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/GlassCard';
import { MarketMoodSphere } from '@/components/ui/MarketMoodSphere';
import { PressureBoard } from '@/components/ui/PressureBoard';
import { SectorRotation } from '@/components/ui/SectorRotation';
import { InstrumentWatchGrid } from '@/components/ui/InstrumentWatchGrid';
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
import { Loader2, Brain, Save, Plus, Trash2, Edit2, Radar } from 'lucide-react';
import { adminApi, apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getAllSymbols } from '@/lib/trading-pairs';

interface MoodData {
  forex: number;
  crypto: number;
  commodities: number;
  equities: number;
  riskOnOff: number; // -100 to 100
  dollarStrength: number; // 0 to 100
  volatility: 'calm' | 'normal' | 'storm';
}

interface PressureItem {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
}

interface SectorRotationItem {
  sector: string;
  momentum: number;
  change24h: number;
}

interface InstrumentData {
  symbol: string;
  price: string;
  directionProbability: { up: number; down: number };
  trendStrength: number;
  activeStrategy: string;
  threats: string[];
}

interface MarketBrainData {
  moodData: MoodData;
  pressureItems: PressureItem[];
  stockSectors: SectorRotationItem[];
  cryptoSectors: SectorRotationItem[];
  capRotation: SectorRotationItem[];
  instruments: InstrumentData[];
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

export default function MarketBrain() {
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

  // Fetch Market Brain data
  const { data, isLoading, error } = useQuery({
    queryKey: ['market-brain-data'],
    queryFn: async (): Promise<MarketBrainData> => {
      try {
        const response = await adminApi.getMarketBrain();
        return response;
      } catch (error: any) {
        // If data doesn't exist yet, return empty structure
        if (error?.message?.includes('not found')) {
          return {
            moodData: {
              forex: 0,
              crypto: 0,
              commodities: 0,
              equities: 0,
              riskOnOff: 0,
              dollarStrength: 0,
              volatility: 'normal',
            },
            pressureItems: [],
            stockSectors: [],
            cryptoSectors: [],
            capRotation: [],
            instruments: [],
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  // Local state for editing
  const [formData, setFormData] = useState<MarketBrainData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: MarketBrainData) => {
      return await adminApi.updateMarketBrain(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-brain-data'] });
      queryClient.refetchQueries({ queryKey: ['market-brain-data'] });
      toast({
        title: 'Success',
        description: 'Market Brain configuration updated successfully',
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

  const updateMoodData = (field: keyof MoodData, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        moodData: { ...formData.moodData, [field]: value },
      });
    }
  };

  const updatePressureItem = (index: number, field: keyof PressureItem, value: any) => {
    if (formData) {
      const updated = formData.pressureItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, pressureItems: updated });
    }
  };

  const addPressureItem = () => {
    if (formData) {
      setFormData({
        ...formData,
        pressureItems: [...formData.pressureItems, { label: 'New Item', value: 0, trend: 'neutral' }],
      });
    }
  };

  const removePressureItem = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        pressureItems: formData.pressureItems.filter((_, i) => i !== index),
      });
    }
  };

  const updateSectorRotation = (section: 'stockSectors' | 'cryptoSectors' | 'capRotation', index: number, field: keyof SectorRotationItem, value: any) => {
    if (formData) {
      const updated = formData[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, [section]: updated });
    }
  };

  const addSectorRotation = (section: 'stockSectors' | 'cryptoSectors' | 'capRotation') => {
    if (formData) {
      setFormData({
        ...formData,
        [section]: [...formData[section], { sector: 'New Sector', momentum: 0, change24h: 0 }],
      });
    }
  };

  const removeSectorRotation = (section: 'stockSectors' | 'cryptoSectors' | 'capRotation', index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        [section]: formData[section].filter((_, i) => i !== index),
      });
    }
  };

  const updateInstrument = (index: number, field: keyof InstrumentData, value: any) => {
    if (formData) {
      const updated = formData.instruments.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, instruments: updated });
    }
  };

  const updateInstrumentProbability = (index: number, direction: 'up' | 'down', value: number) => {
    if (formData) {
      const updated = formData.instruments.map((item, i) =>
        i === index
          ? { ...item, directionProbability: { ...item.directionProbability, [direction]: value } }
          : item
      );
      setFormData({ ...formData, instruments: updated });
    }
  };

  const updateInstrumentThreats = (index: number, threats: string) => {
    if (formData) {
      const threatsArray = threats.split(',').map((t) => t.trim()).filter(Boolean);
      updateInstrument(index, 'threats', threatsArray);
    }
  };

  const addInstrument = () => {
    if (formData) {
      setFormData({
        ...formData,
        instruments: [
          ...formData.instruments,
          {
            symbol: 'NEW',
            price: '0.00',
            directionProbability: { up: 50, down: 50 },
            trendStrength: 0,
            activeStrategy: 'None',
            threats: [],
          },
        ],
      });
    }
  };

  const removeInstrument = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        instruments: formData.instruments.filter((_, i) => i !== index),
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
          <p className="text-destructive mb-2">Error loading Market Brain data</p>
          <p className="text-sm text-muted-foreground">Using default configuration</p>
        </div>
      </div>
    );
  }

  // Initialize form data
  const currentData = data || {
    moodData: {
      forex: 58,
      crypto: 75,
      commodities: 52,
      equities: 65,
      riskOnOff: 35,
      dollarStrength: 62,
      volatility: 'normal',
    },
    pressureItems: [],
    sectorRotations: [],
    instruments: [],
  };

  const displayData = formData || currentData;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Brain className="w-10 h-10 text-primary" />
          <h1 className="font-display text-4xl lg:text-6xl font-bold">
            Algofi <span className="text-primary text-glow">Market Brain</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          What the global market is thinking right now.
        </p>
      </div>

      {/* Market Mood Engine & Macro Pressure Board */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Market Mood Engine */}
        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl mb-1">Market Mood Engine</h3>
              <p className="text-xs text-muted-foreground">Configure market mood parameters</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 backdrop-blur-sm border-border/50"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'mood' ? null : 'mood');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'mood' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          {editingSection === 'mood' && formData ? (
            <div className="pt-24 pb-6 px-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="forex">Forex Mood</Label>
                  <Input
                    id="forex"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.moodData.forex}
                    onChange={(e) => updateMoodData('forex', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crypto">Crypto Mood</Label>
                  <Input
                    id="crypto"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.moodData.crypto}
                    onChange={(e) => updateMoodData('crypto', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commodities">Commodities Mood</Label>
                  <Input
                    id="commodities"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.moodData.commodities}
                    onChange={(e) => updateMoodData('commodities', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equities">Equities Mood</Label>
                  <Input
                    id="equities"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.moodData.equities}
                    onChange={(e) => updateMoodData('equities', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskOnOff">Risk On/Off (-100 to 100)</Label>
                  <Input
                    id="riskOnOff"
                    type="number"
                    min="-100"
                    max="100"
                    value={formData.moodData.riskOnOff}
                    onChange={(e) => updateMoodData('riskOnOff', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dollarStrength">Dollar Strength (0-100)</Label>
                  <Input
                    id="dollarStrength"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.moodData.dollarStrength}
                    onChange={(e) => updateMoodData('dollarStrength', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="volatility">Volatility</Label>
                  <Select
                    value={formData.moodData.volatility}
                    onValueChange={(value) => updateMoodData('volatility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calm">Calm</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="storm">Storm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                    Save
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="p-8 pt-24">
              <MarketMoodSphere data={displayData.moodData} />
            </div>
          )}
        </GlassCard>

        {/* Macro Pressure Board */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Macro Pressure Board</CardTitle>
                <CardDescription>Manage macro pressure indicators</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!formData) {
                    setFormData(JSON.parse(JSON.stringify(currentData)));
                  }
                  setEditingSection(editingSection === 'pressure' ? null : 'pressure');
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {editingSection === 'pressure' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === 'pressure' && formData ? (
              <div className="space-y-4">
                {formData.pressureItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={item.label}
                        onChange={(e) => updatePressureItem(index, 'label', e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Value</Label>
                      <Input
                        type="number"
                        value={item.value}
                        onChange={(e) =>
                          updatePressureItem(index, 'value', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Trend</Label>
                      <Select
                        value={item.trend}
                        onValueChange={(value) => updatePressureItem(index, 'trend', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up">Up</SelectItem>
                          <SelectItem value="down">Down</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removePressureItem(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <PressureBoard pressureItems={displayData.pressureItems} />
            )}
          </CardContent>
          {editingSection === 'pressure' && formData && (
            <CardFooter className="flex items-center justify-between gap-4">
              <Button variant="outline" onClick={addPressureItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
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

      {/* Sector Rotations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sector Rotations</CardTitle>
              <CardDescription>Manage sector rotation data for all three sections</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'sectors' ? null : 'sectors');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'sectors' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'sectors' && formData ? (
            <div className="space-y-8">
              {/* Stock Sectors */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Stock Sectors</h4>
                {formData.stockSectors.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Sector</Label>
                      <Input
                        value={item.sector}
                        onChange={(e) => updateSectorRotation('stockSectors', index, 'sector', e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Momentum</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.momentum}
                        onChange={(e) =>
                          updateSectorRotation('stockSectors', index, 'momentum', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Change 24h (%)</Label>
                      <Input
                        type="number"
                        value={item.change24h}
                        onChange={(e) =>
                          updateSectorRotation('stockSectors', index, 'change24h', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSectorRotation('stockSectors', index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addSectorRotation('stockSectors')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stock Sector
                </Button>
              </div>

              {/* Crypto Sectors */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Crypto Sectors</h4>
                {formData.cryptoSectors.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Sector</Label>
                      <Input
                        value={item.sector}
                        onChange={(e) => updateSectorRotation('cryptoSectors', index, 'sector', e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Momentum</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.momentum}
                        onChange={(e) =>
                          updateSectorRotation('cryptoSectors', index, 'momentum', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Change 24h (%)</Label>
                      <Input
                        type="number"
                        value={item.change24h}
                        onChange={(e) =>
                          updateSectorRotation('cryptoSectors', index, 'change24h', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSectorRotation('cryptoSectors', index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addSectorRotation('cryptoSectors')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Crypto Sector
                </Button>
              </div>

              {/* Market Cap Rotation */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Market Cap Rotation</h4>
                {formData.capRotation.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Sector</Label>
                      <Input
                        value={item.sector}
                        onChange={(e) => updateSectorRotation('capRotation', index, 'sector', e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Momentum</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.momentum}
                        onChange={(e) =>
                          updateSectorRotation('capRotation', index, 'momentum', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Change 24h (%)</Label>
                      <Input
                        type="number"
                        value={item.change24h}
                        onChange={(e) =>
                          updateSectorRotation('capRotation', index, 'change24h', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSectorRotation('capRotation', index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addSectorRotation('capRotation')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cap Rotation
                </Button>
              </div>
            </div>
          ) : (
            <SectorRotation 
              stockSectors={displayData.stockSectors}
              cryptoSectors={displayData.cryptoSectors}
              capRotation={displayData.capRotation}
            />
          )}
        </CardContent>
        {editingSection === 'sectors' && formData && (
          <CardFooter className="flex justify-end">
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

      {/* Instrument Watch Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Instrument Watch Grid</CardTitle>
              <CardDescription>Manage instrument watchlist configurations</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'instruments' ? null : 'instruments');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'instruments' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'instruments' && formData ? (
            <div className="space-y-6">
              {formData.instruments.map((instrument, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Symbol</Label>
                        <Select
                          value={instrument.symbol}
                          onValueChange={(value) => updateInstrument(index, 'symbol', value)}
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
                        <Label>Price</Label>
                        <Input
                          value={instrument.price}
                          onChange={(e) => updateInstrument(index, 'price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Trend Strength</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={instrument.trendStrength}
                          onChange={(e) =>
                            updateInstrument(index, 'trendStrength', parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Up Probability (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={instrument.directionProbability.up}
                          onChange={(e) =>
                            updateInstrumentProbability(index, 'up', parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Down Probability (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={instrument.directionProbability.down}
                          onChange={(e) =>
                            updateInstrumentProbability(index, 'down', parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Active Strategy</Label>
                        <Select
                          value={instrument.activeStrategy}
                          onValueChange={(value) => updateInstrument(index, 'activeStrategy', value)}
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
                      <div className="space-y-2 md:col-span-3">
                        <Label>Threats (comma-separated)</Label>
                        <Input
                          value={instrument.threats.join(', ')}
                          onChange={(e) => updateInstrumentThreats(index, e.target.value)}
                        />
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeInstrument(index)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <InstrumentWatchGrid instruments={displayData.instruments} />
          )}
        </CardContent>
        {editingSection === 'instruments' && formData && (
          <CardFooter className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={addInstrument}>
              <Plus className="w-4 h-4 mr-2" />
              Add Instrument
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

