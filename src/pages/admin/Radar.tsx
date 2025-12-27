import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, Trash2, Edit2, Radar } from 'lucide-react';
import { adminApi, apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getAllSymbols } from '@/lib/trading-pairs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RadarData {
  assetClasses: Array<{
    label: string;
    value: number;
    sublabel: string;
  }>;
  opportunities: Array<{
    symbol: string;
    price: string;
    change: number;
    strategy: string;
    signal: 'In Position' | 'Preparing Entry' | 'Watching';
  }>;
  regimes: Array<{
    name: string;
    description: string;
  }>;
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

const assetCategories = [
  'Forex',
  'Indices',
  'Stocks',
  'Crypto',
  'Gold',
  'Metals',
  'Commodities',
  'Bonds',
  'Currencies',
];

export default function RadarAdmin() {
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

  // Fetch Radar data
  const { data, isLoading, error } = useQuery({
    queryKey: ['radar'],
    queryFn: async (): Promise<RadarData> => {
      try {
        const response = await adminApi.getRadar();
        return response;
      } catch (error: any) {
        // Return default data if API doesn't exist yet
        if (error?.message?.includes('not found')) {
          return {
            assetClasses: [
              { label: 'Forex', value: 72, sublabel: 'Trending' },
              { label: 'Indices', value: 58, sublabel: 'Ranging' },
              { label: 'Stocks', value: 45, sublabel: 'Mixed' },
              { label: 'Crypto', value: 85, sublabel: 'High Vol' },
              { label: 'Gold', value: 67, sublabel: 'Trending' },
              { label: 'Metals', value: 52, sublabel: 'Stable' },
            ],
            opportunities: [
              { symbol: 'XAUUSD', price: '2,034.50', change: 1.24, strategy: 'Nuvex', signal: 'Preparing Entry' },
              { symbol: 'EURUSD', price: '1.0892', change: -0.34, strategy: 'Yark', signal: 'Watching' },
              { symbol: 'BTCUSDT', price: '43,892', change: 2.45, strategy: 'Xylo', signal: 'In Position' },
            ],
            regimes: [
              { name: 'High Volatility Regime', description: 'VIX elevated, wider stops recommended' },
              { name: 'Trending Crypto Regime', description: 'Strong momentum in majors, breakout plays active' },
              { name: 'Risk-Off Equities', description: 'Defensive positioning, reduced exposure' },
            ],
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
      queryClient.invalidateQueries({ queryKey: ['radar'] });
      queryClient.refetchQueries({ queryKey: ['radar'] });
      toast({
        title: 'Success',
        description: 'Radar data updated successfully',
      });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update radar data',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (formData) {
      updateMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    if (data) {
      setFormData(JSON.parse(JSON.stringify(data))); // Reset to original data
    }
    setEditingSection(null);
  };

  const addAssetClass = () => {
    if (formData) {
      setFormData({
        ...formData,
        assetClasses: [
          ...formData.assetClasses,
          { label: '', value: 0, sublabel: '' },
        ],
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

  const addOpportunity = () => {
    if (formData) {
      setFormData({
        ...formData,
        opportunities: [
          ...formData.opportunities,
          { symbol: '', price: '', change: 0, strategy: '', signal: 'Watching' },
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

  const addRegime = () => {
    if (formData) {
      setFormData({
        ...formData,
        regimes: [
          ...formData.regimes,
          { name: '', description: '' },
        ],
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
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const currentData = formData || data || {
    assetClasses: [],
    opportunities: [],
    regimes: [],
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Radar className="w-10 h-10 text-primary" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold">
            Radar <span className="text-primary text-glow">Management</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage and configure radar data for asset classes, opportunities, and market regimes
        </p>
      </div>

      {/* Asset Classes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Asset Classes</CardTitle>
              <CardDescription>Configure asset class heatmap data</CardDescription>
            </div>
            <div className="flex gap-2">
              {editingSection === 'assetClasses' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAssetClass}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!formData && data) {
                    setFormData(JSON.parse(JSON.stringify(data)));
                  }
                  setEditingSection(editingSection === 'assetClasses' ? null : 'assetClasses');
                  if (editingSection === 'assetClasses') {
                    handleCancel();
                  }
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {editingSection === 'assetClasses' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'assetClasses' && formData ? (
            <div className="space-y-4">
              {formData.assetClasses.map((assetClass, index) => (
                <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Label</Label>
                    <Select
                      value={assetClass.label}
                      onValueChange={(value) => {
                        const newAssetClasses = [...formData.assetClasses];
                        newAssetClasses[index].label = value;
                        setFormData({ ...formData, assetClasses: newAssetClasses });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset class" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Value (0-100)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={assetClass.value}
                      onChange={(e) => {
                        const newAssetClasses = [...formData.assetClasses];
                        newAssetClasses[index].value = Number(e.target.value);
                        setFormData({ ...formData, assetClasses: newAssetClasses });
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Sublabel</Label>
                    <Input
                      value={assetClass.sublabel}
                      onChange={(e) => {
                        const newAssetClasses = [...formData.assetClasses];
                        newAssetClasses[index].sublabel = e.target.value;
                        setFormData({ ...formData, assetClasses: newAssetClasses });
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAssetClass(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {currentData.assetClasses.map((assetClass, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="font-semibold">{assetClass.label}</div>
                  <div className="text-2xl font-bold text-primary">{assetClass.value}</div>
                  <div className="text-sm text-muted-foreground">{assetClass.sublabel}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {editingSection === 'assetClasses' && (
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
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Opportunities</CardTitle>
              <CardDescription>Configure trading opportunities</CardDescription>
            </div>
            <div className="flex gap-2">
              {editingSection === 'opportunities' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addOpportunity}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!formData && data) {
                    setFormData(JSON.parse(JSON.stringify(data)));
                  }
                  setEditingSection(editingSection === 'opportunities' ? null : 'opportunities');
                  if (editingSection === 'opportunities') {
                    handleCancel();
                  }
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {editingSection === 'opportunities' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'opportunities' && formData ? (
            <div className="space-y-4">
              {formData.opportunities.map((opportunity, index) => (
                <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Symbol</Label>
                    <Select
                      value={opportunity.symbol}
                      onValueChange={(value) => {
                        const newOpportunities = [...formData.opportunities];
                        newOpportunities[index].symbol = value;
                        setFormData({ ...formData, opportunities: newOpportunities });
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
                  <div className="flex-1">
                    <Label>Price</Label>
                    <Input
                      value={opportunity.price}
                      onChange={(e) => {
                        const newOpportunities = [...formData.opportunities];
                        newOpportunities[index].price = e.target.value;
                        setFormData({ ...formData, opportunities: newOpportunities });
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Change (%)</Label>
                    <Input
                      type="number"
                      value={opportunity.change}
                      onChange={(e) => {
                        const newOpportunities = [...formData.opportunities];
                        newOpportunities[index].change = Number(e.target.value);
                        setFormData({ ...formData, opportunities: newOpportunities });
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Strategy</Label>
                    <Select
                      value={opportunity.strategy}
                      onValueChange={(value) => {
                        const newOpportunities = [...formData.opportunities];
                        newOpportunities[index].strategy = value;
                        setFormData({ ...formData, opportunities: newOpportunities });
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
                  <div className="flex-1">
                    <Label>Signal</Label>
                    <Select
                      value={opportunity.signal}
                      onValueChange={(value: 'In Position' | 'Preparing Entry' | 'Watching') => {
                        const newOpportunities = [...formData.opportunities];
                        newOpportunities[index].signal = value;
                        setFormData({ ...formData, opportunities: newOpportunities });
                      }}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOpportunity(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Symbol</th>
                    <th className="text-left py-2 px-2">Price</th>
                    <th className="text-left py-2 px-2">Change</th>
                    <th className="text-left py-2 px-2">Strategy</th>
                    <th className="text-left py-2 px-2">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.opportunities.map((opportunity, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-2 font-mono">{opportunity.symbol}</td>
                      <td className="py-2 px-2">{opportunity.price}</td>
                      <td className={`py-2 px-2 ${opportunity.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {opportunity.change >= 0 ? '+' : ''}{opportunity.change}%
                      </td>
                      <td className="py-2 px-2">{opportunity.strategy}</td>
                      <td className="py-2 px-2">{opportunity.signal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {editingSection === 'opportunities' && (
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
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Regimes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Market Regimes</CardTitle>
              <CardDescription>Configure market regime detection data</CardDescription>
            </div>
            <div className="flex gap-2">
              {editingSection === 'regimes' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRegime}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!formData && data) {
                    setFormData(JSON.parse(JSON.stringify(data)));
                  }
                  setEditingSection(editingSection === 'regimes' ? null : 'regimes');
                  if (editingSection === 'regimes') {
                    handleCancel();
                  }
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {editingSection === 'regimes' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'regimes' && formData ? (
            <div className="space-y-4">
              {formData.regimes.map((regime, index) => (
                <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Name</Label>
                    <Input
                      value={regime.name}
                      onChange={(e) => {
                        const newRegimes = [...formData.regimes];
                        newRegimes[index].name = e.target.value;
                        setFormData({ ...formData, regimes: newRegimes });
                      }}
                    />
                  </div>
                  <div className="flex-2">
                    <Label>Description</Label>
                    <Input
                      value={regime.description}
                      onChange={(e) => {
                        const newRegimes = [...formData.regimes];
                        newRegimes[index].description = e.target.value;
                        setFormData({ ...formData, regimes: newRegimes });
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRegime(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {currentData.regimes.map((regime, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">{regime.name}</div>
                  <div className="text-sm text-muted-foreground">{regime.description}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {editingSection === 'regimes' && (
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
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

