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
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Trash2, Loader2, Edit, Save, X, ChevronDown, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

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
}

import { getAllSymbols } from '@/lib/trading-pairs';

// Available instruments list - now from JSON file
const AVAILABLE_INSTRUMENTS = [...getAllSymbols(), 'ALL'];

export default function Strategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    { name: 'Nuvex', status: 'active', accuracy: 78, confidence: 'high', bias: 'Bullish Reversal', instruments: ['XAUUSD', 'EURUSD', 'GBPUSD', 'NAS100'] },
    { name: 'Xylo', status: 'active', accuracy: 82, confidence: 'medium', bias: 'Range / Mean-Revert', instruments: ['BTCUSDT', 'ETHUSDT', 'EURUSD'] },
    { name: 'Drav', status: 'waiting', accuracy: 71, confidence: 'high', bias: 'SMC Liquidity Hunt', instruments: ['XAUUSD', 'NAS100', 'US30'] },
    { name: 'Yark', status: 'active', accuracy: 85, confidence: 'high', bias: 'Statistical Edge', instruments: ['EURUSD', 'GBPJPY', 'AUDUSD', 'BTCUSDT'] },
    { name: 'Tenzor', status: 'cooling', accuracy: 76, confidence: 'medium', bias: 'Momentum Breakout', instruments: ['TSLA', 'AAPL', 'NAS100', 'BTCUSDT'] },
    { name: 'Omnix', status: 'active', accuracy: 89, confidence: 'high', bias: 'Multi-Factor Balanced', instruments: ['ALL'] },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
          <Card key={index} className="bg-card border-border">
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


