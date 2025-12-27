import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuralSphere } from '@/components/ui/NeuralSphere';
import { DataStream } from '@/components/ui/DataStream';
import { SentimentBar } from '@/components/ui/SentimentBar';
import { StrategyCard } from '@/components/ui/StrategyCard';
import { TickerTape } from '@/components/ui/TickerTape';
import { StatusBadge } from '@/components/ui/StatusBadge';
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
import { Loader2, Activity, Zap, Globe, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Target,
  BarChart3,
  TrendingUp,
  LineChart,
  Cpu,
  PieChart,
} from 'lucide-react';

interface NeuralConfig {
  nodes: number;
  connections: number;
  latency: number;
}

interface DataStreamConfig {
  label: string;
  active: boolean;
  delay: number;
}

interface MarketSentiment {
  forex: { bullish: number; neutral: number; bearish: number };
  crypto: { bullish: number; neutral: number; bearish: number };
  equities: { bullish: number; neutral: number; bearish: number };
}

interface Strategy {
  name: string;
  icon: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
  path: string;
}

interface NewsTag {
  text: string;
  type: 'bullish' | 'bearish' | 'neutral';
}

interface AIBrainData {
  neuralConfig: NeuralConfig;
  dataStreams: DataStreamConfig[];
  marketSentiment: MarketSentiment;
  strategies: Strategy[];
  newsTags: NewsTag[];
  dataPointsPerSecond: number;
}

const iconMap: Record<string, any> = {
  Target,
  BarChart3,
  TrendingUp,
  LineChart,
  Cpu,
  PieChart,
};

const iconOptions = [
  { value: 'Target', label: 'Target' },
  { value: 'BarChart3', label: 'Bar Chart' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'LineChart', label: 'Line Chart' },
  { value: 'Cpu', label: 'CPU' },
  { value: 'PieChart', label: 'Pie Chart' },
];

export default function NeuralProcessing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Fetch all AI Brain data
  const { data, isLoading, error } = useQuery({
    queryKey: ['ai-brain-data'],
    queryFn: async (): Promise<AIBrainData> => {
      try {
        const response = await apiClient.get<AIBrainData>('/admin/ai-brain');
        return response;
      } catch (error) {
        // Return default data if API doesn't exist yet
        return {
          neuralConfig: { nodes: 60, connections: 245, latency: 12 },
          dataStreams: [
            { label: 'Forex Majors', active: true, delay: 0 },
            { label: 'Indices (US, EU, Asia)', active: true, delay: 200 },
            { label: 'Stocks (S&P 500)', active: true, delay: 400 },
            { label: 'Gold & Commodities', active: true, delay: 600 },
            { label: 'Crypto (BTC, ETH, Alts)', active: true, delay: 800 },
          ],
          marketSentiment: {
            forex: { bullish: 45, neutral: 30, bearish: 25 },
            crypto: { bullish: 62, neutral: 18, bearish: 20 },
            equities: { bullish: 38, neutral: 42, bearish: 20 },
          },
          strategies: [
            {
              name: 'Nuvex',
              icon: 'Target',
              status: 'active',
              accuracy: 78,
              confidence: 'high',
              bias: 'Bullish Reversal',
              instruments: ['XAUUSD', 'EURUSD', 'GBPUSD', 'NAS100'],
              path: '/strategy/nuvex',
            },
            {
              name: 'Xylo',
              icon: 'BarChart3',
              status: 'active',
              accuracy: 82,
              confidence: 'medium',
              bias: 'Range / Mean-Revert',
              instruments: ['BTCUSDT', 'ETHUSDT', 'EURUSD'],
              path: '/strategy/xylo',
            },
            {
              name: 'Drav',
              icon: 'TrendingUp',
              status: 'waiting',
              accuracy: 71,
              confidence: 'high',
              bias: 'SMC Liquidity Hunt',
              instruments: ['XAUUSD', 'NAS100', 'US30'],
              path: '/strategy/drav',
            },
            {
              name: 'Yark',
              icon: 'LineChart',
              status: 'active',
              accuracy: 85,
              confidence: 'high',
              bias: 'Statistical Edge',
              instruments: ['EURUSD', 'GBPJPY', 'AUDUSD', 'BTCUSDT'],
              path: '/strategy/yark',
            },
            {
              name: 'Tenzor',
              icon: 'Cpu',
              status: 'cooling',
              accuracy: 76,
              confidence: 'medium',
              bias: 'Momentum Breakout',
              instruments: ['TSLA', 'AAPL', 'NAS100', 'BTCUSDT'],
              path: '/strategy/tenzor',
            },
            {
              name: 'Omnix',
              icon: 'PieChart',
              status: 'active',
              accuracy: 89,
              confidence: 'high',
              bias: 'Multi-Factor Balanced',
              instruments: ['ALL'],
              path: '/strategy/omnix',
            },
          ],
          newsTags: [
            { text: 'Risk-On', type: 'bullish' },
            { text: 'FOMC Today', type: 'neutral' },
            { text: 'China Data', type: 'bearish' },
            { text: 'Oil Surge', type: 'neutral' },
          ],
          dataPointsPerSecond: 2400000,
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Local state for editing
  const [formData, setFormData] = useState<AIBrainData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: AIBrainData) => {
      return await apiClient.post('/admin/ai-brain', config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-brain-data'] });
      toast({
        title: 'Success',
        description: 'AI Brain configuration updated successfully',
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

  const updateFormData = (section: keyof AIBrainData, value: any) => {
    if (formData) {
      setFormData({ ...formData, [section]: value });
    }
  };

  const updateNeuralConfig = (field: keyof NeuralConfig, value: number) => {
    if (formData) {
      setFormData({
        ...formData,
        neuralConfig: { ...formData.neuralConfig, [field]: value },
      });
    }
  };

  const updateDataStream = (index: number, field: keyof DataStreamConfig, value: any) => {
    if (formData) {
      const updated = formData.dataStreams.map((stream, i) =>
        i === index ? { ...stream, [field]: value } : stream
      );
      setFormData({ ...formData, dataStreams: updated });
    }
  };

  const addDataStream = () => {
    if (formData) {
      setFormData({
        ...formData,
        dataStreams: [...formData.dataStreams, { label: 'New Stream', active: true, delay: 0 }],
      });
    }
  };

  const removeDataStream = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        dataStreams: formData.dataStreams.filter((_, i) => i !== index),
      });
    }
  };

  const updateMarketSentiment = (
    market: keyof MarketSentiment,
    type: 'bullish' | 'neutral' | 'bearish',
    value: number
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        marketSentiment: {
          ...formData.marketSentiment,
          [market]: { ...formData.marketSentiment[market], [type]: value },
        },
      });
    }
  };

  const updateStrategy = (index: number, field: keyof Strategy, value: any) => {
    if (formData) {
      const updated = formData.strategies.map((strategy, i) =>
        i === index ? { ...strategy, [field]: value } : strategy
      );
      setFormData({ ...formData, strategies: updated });
    }
  };

  const updateStrategyInstruments = (index: number, instruments: string) => {
    if (formData) {
      const instrumentsArray = instruments.split(',').map((i) => i.trim()).filter(Boolean);
      updateStrategy(index, 'instruments', instrumentsArray);
    }
  };

  const addStrategy = () => {
    if (formData) {
      setFormData({
        ...formData,
        strategies: [
          ...formData.strategies,
          {
            name: 'New Strategy',
            icon: 'Target',
            status: 'waiting',
            accuracy: 0,
            confidence: 'medium',
            bias: '',
            instruments: [],
            path: '/strategy/new',
          },
        ],
      });
    }
  };

  const removeStrategy = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        strategies: formData.strategies.filter((_, i) => i !== index),
      });
    }
  };

  const updateNewsTag = (index: number, field: keyof NewsTag, value: any) => {
    if (formData) {
      const updated = formData.newsTags.map((tag, i) =>
        i === index ? { ...tag, [field]: value } : tag
      );
      setFormData({ ...formData, newsTags: updated });
    }
  };

  const addNewsTag = () => {
    if (formData) {
      setFormData({
        ...formData,
        newsTags: [...formData.newsTags, { text: 'New Tag', type: 'neutral' }],
      });
    }
  };

  const removeNewsTag = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        newsTags: formData.newsTags.filter((_, i) => i !== index),
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
          <p className="text-destructive mb-2">Error loading AI Brain data</p>
          <p className="text-sm text-muted-foreground">Using default configuration</p>
        </div>
      </div>
    );
  }

  // Initialize form data
  const currentData = data || {
    neuralConfig: { nodes: 60, connections: 245, latency: 12 },
    dataStreams: [],
    marketSentiment: {
      forex: { bullish: 45, neutral: 30, bearish: 25 },
      crypto: { bullish: 62, neutral: 18, bearish: 20 },
      equities: { bullish: 38, neutral: 42, bearish: 20 },
    },
    strategies: [],
    newsTags: [],
    dataPointsPerSecond: 2400000,
  };

  const displayData = formData || currentData;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
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
          <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl mb-1">Neural Network Configuration</h3>
              <p className="text-xs text-muted-foreground">Configure neural processing parameters</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 backdrop-blur-sm border-border/50"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'neural' ? null : 'neural');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'neural' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          {editingSection === 'neural' && formData ? (
            <div className="pt-24 pb-6 px-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="nodes">Nodes</Label>
                  <Input
                    id="nodes"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.neuralConfig.nodes}
                    onChange={(e) =>
                      updateNeuralConfig('nodes', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connections">Connections</Label>
                  <Input
                    id="connections"
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.neuralConfig.connections}
                    onChange={(e) =>
                      updateNeuralConfig('connections', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latency">Latency (ms)</Label>
                  <Input
                    id="latency"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.neuralConfig.latency}
                    onChange={(e) =>
                      updateNeuralConfig('latency', parseInt(e.target.value) || 0)
                    }
                  />
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
            <>
              <div className="h-[400px]">
                <NeuralSphere />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium">Neural Processing Active</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {displayData.neuralConfig.nodes} nodes • {displayData.neuralConfig.connections}{' '}
                  connections • {displayData.neuralConfig.latency}ms latency
                </p>
              </div>
            </>
          )}
        </GlassCard>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Data Streams</CardTitle>
                <CardDescription>Manage data stream configurations</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!formData) {
                    setFormData(JSON.parse(JSON.stringify(currentData)));
                  }
                  setEditingSection(editingSection === 'streams' ? null : 'streams');
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {editingSection === 'streams' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === 'streams' && formData ? (
              <div className="space-y-4">
                {formData.dataStreams.map((stream, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={stream.label}
                        onChange={(e) => updateDataStream(index, 'label', e.target.value)}
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label>Delay</Label>
                      <Input
                        type="number"
                        value={stream.delay}
                        onChange={(e) =>
                          updateDataStream(index, 'delay', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Active</Label>
                      <Select
                        value={stream.active ? 'true' : 'false'}
                        onValueChange={(value) =>
                          updateDataStream(index, 'active', value === 'true')
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDataStream(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="space-y-2 mt-6">
                  <Label>Data Points Per Second</Label>
                  <Input
                    type="number"
                    value={formData.dataPointsPerSecond}
                    onChange={(e) =>
                      updateFormData('dataPointsPerSecond', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {displayData.dataStreams.map((stream, index) => (
                  <DataStream
                    key={index}
                    label={stream.label}
                    active={stream.active}
                    delay={stream.delay}
                  />
                ))}
                <div className="pt-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>
                    Processing {(displayData.dataPointsPerSecond / 1000000).toFixed(1)}M data
                    points / second
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          {editingSection === 'streams' && formData && (
            <CardFooter className="flex items-center justify-between gap-4">
              <Button variant="outline" onClick={addDataStream}>
                <Plus className="w-4 h-4 mr-2" />
                Add Stream
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

      {/* Global Market Sentiment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Global Market Sentiment</CardTitle>
                <CardDescription>Configure market sentiment percentages</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'sentiment' ? null : 'sentiment');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'sentiment' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'sentiment' && formData ? (
            <div className="space-y-6">
              {(['forex', 'crypto', 'equities'] as const).map((market) => (
                <div key={market} className="space-y-4">
                  <h4 className="font-semibold capitalize">{market}</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Bullish (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.marketSentiment[market].bullish}
                        onChange={(e) =>
                          updateMarketSentiment(
                            market,
                            'bullish',
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Neutral (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.marketSentiment[market].neutral}
                        onChange={(e) =>
                          updateMarketSentiment(
                            market,
                            'neutral',
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bearish (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.marketSentiment[market].bearish}
                        onChange={(e) =>
                          updateMarketSentiment(
                            market,
                            'bearish',
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="grid md:grid-cols-3 gap-6">
              <SentimentBar
                label="Forex"
                bullish={displayData.marketSentiment.forex.bullish}
                neutral={displayData.marketSentiment.forex.neutral}
                bearish={displayData.marketSentiment.forex.bearish}
              />
              <SentimentBar
                label="Crypto"
                bullish={displayData.marketSentiment.crypto.bullish}
                neutral={displayData.marketSentiment.crypto.neutral}
                bearish={displayData.marketSentiment.crypto.bearish}
              />
              <SentimentBar
                label="Equities"
                bullish={displayData.marketSentiment.equities.bullish}
                neutral={displayData.marketSentiment.equities.neutral}
                bearish={displayData.marketSentiment.equities.bearish}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Data Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Data Feed</CardTitle>
              <CardDescription>Manage news tags</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'news' ? null : 'news');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'news' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'news' && formData ? (
            <div className="space-y-4">
              {formData.newsTags.map((tag, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Text</Label>
                    <Input
                      value={tag.text}
                      onChange={(e) => updateNewsTag(index, 'text', e.target.value)}
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={tag.type}
                      onValueChange={(value) =>
                        updateNewsTag(index, 'type', value as NewsTag['type'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bullish">Bullish</SelectItem>
                        <SelectItem value="bearish">Bearish</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNewsTag(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={addNewsTag}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tag
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
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <TickerTape />
              <div className="flex flex-wrap gap-2">
                {displayData.newsTags.map((tag, i) => (
                  <StatusBadge key={i} sentiment={tag.type} text={tag.text} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
