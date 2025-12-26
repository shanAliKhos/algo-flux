import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, Save, Plus, Trash2, Compass } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ConditionsData {
  marketPersonality: Array<{
    label: string;
    active: boolean;
    icon: string;
  }>;
  behaviorMap: Array<{
    asset: string;
    behavior: string;
    sentiment: number;
  }>;
  strategyAlignment: Array<{
    asset: string;
    strategies: Array<{
      name: string;
      status: string;
      opportunity: string;
    }>;
  }>;
}

const personalityIcons = [
  { value: 'Activity', label: 'Activity' },
  { value: 'Clock', label: 'Clock' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Droplets', label: 'Droplets' },
  { value: 'Newspaper', label: 'Newspaper' },
  { value: 'Zap', label: 'Zap' },
];

export default function ConditionsAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Fetch Conditions data
  const { data, isLoading, error } = useQuery({
    queryKey: ['conditions'],
    queryFn: async (): Promise<ConditionsData> => {
      try {
        const response = await adminApi.getConditions();
        return response;
      } catch (error: any) {
        // Return default data if API doesn't exist yet
        if (error?.message?.includes('not found')) {
          return {
            marketPersonality: [
              { label: 'Volatile', active: true, icon: 'Activity' },
              { label: 'Slow', active: false, icon: 'Clock' },
              { label: 'Ranging', active: false, icon: 'TrendingUp' },
              { label: 'Trending', active: true, icon: 'TrendingUp' },
              { label: 'Liquidity-heavy', active: true, icon: 'Droplets' },
              { label: 'News-driven', active: false, icon: 'Newspaper' },
            ],
            behaviorMap: [
              { asset: 'Forex', behavior: 'Risk-On', sentiment: 72 },
              { asset: 'Crypto', behavior: 'Bullish', sentiment: 85 },
              { asset: 'Stocks', behavior: 'Sector Rotation', sentiment: 58 },
              { asset: 'Gold', behavior: 'Safe-Haven Mild', sentiment: 45 },
              { asset: 'Indices', behavior: 'Volatility Spike', sentiment: 62 },
            ],
            strategyAlignment: [
              {
                asset: 'Forex',
                strategies: [
                  { name: 'Nuvex', status: 'active', opportunity: 'high' },
                  { name: 'Drav', status: 'active', opportunity: 'medium' },
                  { name: 'Xylo', status: 'disabled', opportunity: 'low' },
                ],
              },
              {
                asset: 'Crypto',
                strategies: [
                  { name: 'Tenzor', status: 'active', opportunity: 'high' },
                  { name: 'Omnix', status: 'active', opportunity: 'high' },
                  { name: 'Yark', status: 'active', opportunity: 'medium' },
                ],
              },
              {
                asset: 'Stocks',
                strategies: [
                  { name: 'Yark', status: 'active', opportunity: 'high' },
                  { name: 'Omnix', status: 'active', opportunity: 'medium' },
                  { name: 'Tenzor', status: 'disabled', opportunity: 'low' },
                ],
              },
              {
                asset: 'Gold',
                strategies: [
                  { name: 'Drav', status: 'active', opportunity: 'high' },
                  { name: 'Nuvex', status: 'active', opportunity: 'medium' },
                  { name: 'Xylo', status: 'disabled', opportunity: 'low' },
                ],
              },
            ],
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  // Local state for editing
  const [formData, setFormData] = useState<ConditionsData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: ConditionsData) => {
      return await adminApi.updateConditions(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditions'] });
      toast({
        title: 'Success',
        description: 'Conditions updated successfully',
      });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update conditions',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (formData) {
      updateMutation.mutate(formData);
    }
  };

  const addPersonalityItem = () => {
    if (formData) {
      setFormData({
        ...formData,
        marketPersonality: [
          ...formData.marketPersonality,
          { label: '', active: false, icon: 'Activity' },
        ],
      });
    }
  };

  const removePersonalityItem = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        marketPersonality: formData.marketPersonality.filter((_, i) => i !== index),
      });
    }
  };

  const addBehaviorItem = () => {
    if (formData) {
      setFormData({
        ...formData,
        behaviorMap: [
          ...formData.behaviorMap,
          { asset: '', behavior: '', sentiment: 0 },
        ],
      });
    }
  };

  const removeBehaviorItem = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        behaviorMap: formData.behaviorMap.filter((_, i) => i !== index),
      });
    }
  };

  const addStrategyAlignment = () => {
    if (formData) {
      setFormData({
        ...formData,
        strategyAlignment: [
          ...formData.strategyAlignment,
          { asset: '', strategies: [] },
        ],
      });
    }
  };

  const addStrategyToAlignment = (alignmentIndex: number) => {
    if (formData) {
      const updated = [...formData.strategyAlignment];
      updated[alignmentIndex].strategies.push({
        name: '',
        status: 'active',
        opportunity: 'medium',
      });
      setFormData({ ...formData, strategyAlignment: updated });
    }
  };

  const removeStrategyFromAlignment = (alignmentIndex: number, strategyIndex: number) => {
    if (formData) {
      const updated = [...formData.strategyAlignment];
      updated[alignmentIndex].strategies = updated[alignmentIndex].strategies.filter(
        (_, i) => i !== strategyIndex,
      );
      setFormData({ ...formData, strategyAlignment: updated });
    }
  };

  const removeStrategyAlignment = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        strategyAlignment: formData.strategyAlignment.filter((_, i) => i !== index),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load conditions data</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Compass className="w-8 h-8 text-primary" />
            Market Conditions
          </h1>
          <p className="text-muted-foreground mt-1">Manage market conditions data</p>
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
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Market Personality */}
      <Card>
        <CardHeader>
          <CardTitle>Market Personality</CardTitle>
          <CardDescription>Configure market personality traits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.marketPersonality.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <Label>Label</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...formData.marketPersonality];
                      updated[index].label = e.target.value;
                      setFormData({ ...formData, marketPersonality: updated });
                    }}
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Select
                    value={item.icon}
                    onValueChange={(value) => {
                      const updated = [...formData.marketPersonality];
                      updated[index].icon = value;
                      setFormData({ ...formData, marketPersonality: updated });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityIcons.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    checked={item.active}
                    onCheckedChange={(checked) => {
                      const updated = [...formData.marketPersonality];
                      updated[index].active = checked as boolean;
                      setFormData({ ...formData, marketPersonality: updated });
                    }}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePersonalityItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addPersonalityItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Personality Item
          </Button>
        </CardContent>
      </Card>

      {/* Behavior Map */}
      <Card>
        <CardHeader>
          <CardTitle>Behavior Map</CardTitle>
          <CardDescription>Configure asset behavior data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.behaviorMap.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <Label>Asset</Label>
                  <Input
                    value={item.asset}
                    onChange={(e) => {
                      const updated = [...formData.behaviorMap];
                      updated[index].asset = e.target.value;
                      setFormData({ ...formData, behaviorMap: updated });
                    }}
                  />
                </div>
                <div>
                  <Label>Behavior</Label>
                  <Input
                    value={item.behavior}
                    onChange={(e) => {
                      const updated = [...formData.behaviorMap];
                      updated[index].behavior = e.target.value;
                      setFormData({ ...formData, behaviorMap: updated });
                    }}
                  />
                </div>
                <div>
                  <Label>Sentiment (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.sentiment}
                    onChange={(e) => {
                      const updated = [...formData.behaviorMap];
                      updated[index].sentiment = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, behaviorMap: updated });
                    }}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeBehaviorItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addBehaviorItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Behavior Item
          </Button>
        </CardContent>
      </Card>

      {/* Strategy Alignment */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Alignment</CardTitle>
          <CardDescription>Configure strategy alignment by asset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.strategyAlignment.map((alignment, alignmentIndex) => (
            <div key={alignmentIndex} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label>Asset</Label>
                  <Input
                    value={alignment.asset}
                    onChange={(e) => {
                      const updated = [...formData.strategyAlignment];
                      updated[alignmentIndex].asset = e.target.value;
                      setFormData({ ...formData, strategyAlignment: updated });
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStrategyAlignment(alignmentIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Strategies</Label>
                {alignment.strategies.map((strategy, strategyIndex) => (
                  <div
                    key={strategyIndex}
                    className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={strategy.name}
                          onChange={(e) => {
                            const updated = [...formData.strategyAlignment];
                            updated[alignmentIndex].strategies[strategyIndex].name =
                              e.target.value;
                            setFormData({ ...formData, strategyAlignment: updated });
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Status</Label>
                        <Select
                          value={strategy.status}
                          onValueChange={(value) => {
                            const updated = [...formData.strategyAlignment];
                            updated[alignmentIndex].strategies[strategyIndex].status = value;
                            setFormData({ ...formData, strategyAlignment: updated });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Opportunity</Label>
                        <Select
                          value={strategy.opportunity}
                          onValueChange={(value) => {
                            const updated = [...formData.strategyAlignment];
                            updated[alignmentIndex].strategies[strategyIndex].opportunity =
                              value;
                            setFormData({ ...formData, strategyAlignment: updated });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeStrategyFromAlignment(alignmentIndex, strategyIndex)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addStrategyToAlignment(alignmentIndex)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Strategy
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addStrategyAlignment}>
            <Plus className="w-4 h-4 mr-2" />
            Add Strategy Alignment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

