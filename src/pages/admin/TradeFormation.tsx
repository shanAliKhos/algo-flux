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
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Loader2, Save, Plus, Trash2, Edit2, Sparkles } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getAllPairs, getPairsGrouped, type TradingPair } from '@/lib/trading-pairs';
import { cn } from '@/lib/utils';

interface TradeFormationData {
  opportunityDetection: {
    instruments: Array<{
      symbol: string;
      reason: string;
    }>;
    selectedInstrument: string;
  };
  patternRecognition: {
    patterns: string[];
    detectedPattern: string;
    chartData: Array<{ x: number; y: number }>;
  };
  riskShaping: Array<{
    label: string;
    value: string;
    bar: number;
  }>;
  executionBlueprint: {
    entry: string;
    stopLoss: string;
    takeProfit: string;
    rrRatio: string;
  };
  liveManagement: Array<{
    label: string;
    status: string;
    active: boolean;
  }>;
  finalExitReport: {
    exitReason: string;
    rating: string;
    profitLoss: string;
    duration: string;
    notes: string;
  };
}

export default function TradeFormationAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Fetch Trade Formation data
  const { data, isLoading, error } = useQuery({
    queryKey: ['trade-formation'],
    queryFn: async (): Promise<TradeFormationData> => {
      try {
        const response = await adminApi.getTradeFormation();
        return response;
      } catch (error: any) {
        // Return default data if API doesn't exist yet
        if (error?.message?.includes('not found')) {
          return {
            opportunityDetection: {
              instruments: [
                { symbol: "XAUUSD", reason: "Liquidity sweep detected at 2,640.00" },
                { symbol: "EURUSD", reason: "Support level bounce at 1.0850" },
                { symbol: "BTCUSDT", reason: "Breakout above resistance at 45,200" },
                { symbol: "NAS100", reason: "Bullish divergence on RSI" },
                { symbol: "AAPL", reason: "Earnings beat expectations" },
                { symbol: "TSLA", reason: "Volume spike with bullish engulfing" },
                { symbol: "ETHUSDT", reason: "Key level retest at 2,800" },
                { symbol: "GBPUSD", reason: "Bank of England rate decision impact" }
              ],
              selectedInstrument: "XAUUSD"
            },
            patternRecognition: {
              patterns: ["Engulfing", "CHOCH", "BOS", "Trend Break"],
              detectedPattern: "Engulfing",
              chartData: [
                { x: 10, y: 60 }, { x: 30, y: 45 }, { x: 50, y: 55 }, { x: 70, y: 35 },
                { x: 90, y: 45 }, { x: 110, y: 25 }, { x: 130, y: 40 }, { x: 150, y: 20 },
                { x: 170, y: 35 }, { x: 190, y: 15 }
              ]
            },
            riskShaping: [
              { label: "Position Size", value: "0.85 lots", bar: 42 },
              { label: "Volatility Adj.", value: "-15%", bar: 85 },
              { label: "DD Protection", value: "Active", bar: 100 },
              { label: "Correlation Check", value: "Passed", bar: 95 },
            ],
            executionBlueprint: {
              entry: "2,641.50",
              stopLoss: "2,635.00",
              takeProfit: "2,658.00",
              rrRatio: "2.54"
            },
            liveManagement: [
              { label: "Dynamic Stop", status: "Trailing +25 pips", active: true },
              { label: "Partial TP", status: "50% @ 2,652.00", active: true },
              { label: "Time Stop", status: "4h remaining", active: false },
              { label: "Sentiment", status: "Still bullish", active: true },
            ],
            finalExitReport: {
              exitReason: "Take Profit Hit",
              rating: "A",
              profitLoss: "+$1,245",
              duration: "2h 34m",
              notes: "Strong momentum continuation after liquidity grab. Price respected institutional order block perfectly."
            }
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  // Local state for editing
  const [formData, setFormData] = useState<TradeFormationData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: TradeFormationData) => {
      return await adminApi.updateTradeFormation(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-formation'] });
      toast({
        title: 'Success',
        description: 'Trade Formation data updated successfully',
      });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update trade formation data',
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
          <p className="text-destructive mb-2">Error loading Trade Formation data</p>
          <p className="text-sm text-muted-foreground">Using default configuration</p>
        </div>
      </div>
    );
  }

  const currentData = data || {
    opportunityDetection: {
      instruments: [
        { symbol: "XAUUSD", reason: "Liquidity sweep detected at 2,640.00" },
        { symbol: "EURUSD", reason: "Support level bounce at 1.0850" },
        { symbol: "BTCUSDT", reason: "Breakout above resistance at 45,200" },
        { symbol: "NAS100", reason: "Bullish divergence on RSI" },
        { symbol: "AAPL", reason: "Earnings beat expectations" },
        { symbol: "TSLA", reason: "Volume spike with bullish engulfing" },
        { symbol: "ETHUSDT", reason: "Key level retest at 2,800" },
        { symbol: "GBPUSD", reason: "Bank of England rate decision impact" }
      ],
      selectedInstrument: "XAUUSD"
    },
    patternRecognition: {
      patterns: ["Engulfing", "CHOCH", "BOS", "Trend Break"],
      detectedPattern: "Engulfing",
      chartData: []
    },
    riskShaping: [],
    executionBlueprint: {
      entry: "2,641.50",
      stopLoss: "2,635.00",
      takeProfit: "2,658.00",
      rrRatio: "2.54"
    },
    liveManagement: [],
    finalExitReport: {
      exitReason: "Take Profit Hit",
      rating: "A",
      profitLoss: "+$1,245",
      duration: "2h 34m",
      notes: ""
    }
  };

  const displayData = formData || currentData;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold">
            Trade Formation <span className="text-primary text-glow">Management</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage and configure trade formation data and sections
        </p>
      </div>

      {/* Opportunity Detection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Opportunity Detection</CardTitle>
              <CardDescription>Configure instruments and detection reason</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'opportunity' ? null : 'opportunity');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'opportunity' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'opportunity' && formData ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Instruments</Label>
                <div className="max-h-60 overflow-y-auto border rounded-md p-4 space-y-2">
                  {Object.entries(getPairsGrouped()).map(([category, pairs]) => (
                    <div key={category} className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">{category}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {pairs.map((pair: TradingPair) => {
                          const instrument = formData.opportunityDetection.instruments.find(
                            (inst) => inst.symbol === pair.symbol
                          );
                          const isChecked = !!instrument;
                          
                          return (
                            <div key={pair.symbol} className="flex items-center space-x-2">
                              <Checkbox
                                id={`instrument-${pair.symbol}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const currentInstruments = formData.opportunityDetection.instruments;
                                  if (checked) {
                                    // Add instrument with a default reason
                                    const defaultReason = `Opportunity detected for ${pair.symbol}`;
                                    setFormData({
                                      ...formData,
                                      opportunityDetection: {
                                        ...formData.opportunityDetection,
                                        instruments: [
                                          ...currentInstruments,
                                          { symbol: pair.symbol, reason: defaultReason },
                                        ],
                                      },
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      opportunityDetection: {
                                        ...formData.opportunityDetection,
                                        instruments: currentInstruments.filter(
                                          (inst) => inst.symbol !== pair.symbol
                                        ),
                                      },
                                    });
                                  }
                                }}
                              />
                              <label
                                htmlFor={`instrument-${pair.symbol}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {pair.symbol}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: {formData.opportunityDetection.instruments.length} instrument(s)
                </p>
              </div>
              
              {/* Edit reasons for each selected instrument */}
              <div className="space-y-4">
                <Label>Instrument Reasons</Label>
                {formData.opportunityDetection.instruments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No instruments selected. Select instruments above to add reasons.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.opportunityDetection.instruments.map((instrument, index) => (
                      <div key={instrument.symbol} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold font-mono">{instrument.symbol}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                opportunityDetection: {
                                  ...formData.opportunityDetection,
                                  instruments: formData.opportunityDetection.instruments.filter(
                                    (_, i) => i !== index
                                  ),
                                },
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder={`Enter reason for ${instrument.symbol}...`}
                          value={instrument.reason}
                          onChange={(e) => {
                            const updated = formData.opportunityDetection.instruments.map((inst, i) =>
                              i === index ? { ...inst, reason: e.target.value } : inst
                            );
                            setFormData({
                              ...formData,
                              opportunityDetection: {
                                ...formData.opportunityDetection,
                                instruments: updated,
                              },
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Selected Instrument</Label>
                <Select
                  value={formData.opportunityDetection.selectedInstrument}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      opportunityDetection: {
                        ...formData.opportunityDetection,
                        selectedInstrument: value,
                      },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.opportunityDetection.instruments.length === 0 ? (
                      <SelectItem value="" disabled>No instruments selected</SelectItem>
                    ) : (
                      formData.opportunityDetection.instruments.map((instrument) => (
                        <SelectItem key={instrument.symbol} value={instrument.symbol}>
                          {instrument.symbol}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Instruments ({displayData.opportunityDetection.instruments.length})</Label>
                <div className="space-y-2">
                  {displayData.opportunityDetection.instruments.map((instrument) => {
                    // Handle both old format (string) and new format (object)
                    const symbol = typeof instrument === 'string' ? instrument : instrument.symbol;
                    const reason = typeof instrument === 'string' 
                      ? (displayData.opportunityDetection.reason || 'No reason provided')
                      : instrument.reason;
                    const isSelected = symbol === displayData.opportunityDetection.selectedInstrument;
                    const pair = getAllPairs().find(p => p.symbol === symbol);
                    
                    return (
                      <div
                        key={symbol}
                        className={cn(
                          "p-3 rounded-lg border transition-all",
                          isSelected
                            ? "bg-primary/10 border-primary/20"
                            : "bg-muted/30 border-border"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-mono font-semibold",
                              isSelected ? "text-primary" : "text-foreground"
                            )}>
                              {symbol}
                            </span>
                            {isSelected && (
                              <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                                Selected
                              </span>
                            )}
                            {pair && (
                              <span className="text-xs text-muted-foreground">({pair.name})</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-foreground">{reason || 'No reason provided'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'opportunity' && formData && (
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

      {/* Pattern Recognition */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pattern Recognition</CardTitle>
              <CardDescription>Configure patterns and detected pattern</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'pattern' ? null : 'pattern');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'pattern' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'pattern' && formData ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Patterns (comma-separated)</Label>
                <Input
                  value={formData.patternRecognition.patterns.join(', ')}
                  onChange={(e) => {
                    const patterns = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    setFormData({
                      ...formData,
                      patternRecognition: {
                        ...formData.patternRecognition,
                        patterns,
                      },
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Detected Pattern</Label>
                <Input
                  value={formData.patternRecognition.detectedPattern}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      patternRecognition: {
                        ...formData.patternRecognition,
                        detectedPattern: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Patterns: {displayData.patternRecognition.patterns.join(', ')}</p>
              <p className="text-sm">Detected: <span className="font-medium">{displayData.patternRecognition.detectedPattern}</span></p>
            </div>
          )}
        </CardContent>
        {editingSection === 'pattern' && formData && (
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

      {/* Risk Shaping */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Shaping</CardTitle>
              <CardDescription>Manage risk shaping items</CardDescription>
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
            <div className="space-y-4">
              {formData.riskShaping.map((item, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const updated = formData.riskShaping.map((it, i) =>
                          i === index ? { ...it, label: e.target.value } : it
                        );
                        setFormData({ ...formData, riskShaping: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={item.value}
                      onChange={(e) => {
                        const updated = formData.riskShaping.map((it, i) =>
                          i === index ? { ...it, value: e.target.value } : it
                        );
                        setFormData({ ...formData, riskShaping: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bar (%)</Label>
                    <Input
                      type="number"
                      value={item.bar}
                      onChange={(e) => {
                        const updated = formData.riskShaping.map((it, i) =>
                          i === index ? { ...it, bar: parseInt(e.target.value) || 0 } : it
                        );
                        setFormData({ ...formData, riskShaping: updated });
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setFormData({
                        ...formData,
                        riskShaping: formData.riskShaping.filter((_, i) => i !== index),
                      });
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => {
                setFormData({
                  ...formData,
                  riskShaping: [
                    ...formData.riskShaping,
                    { label: "New Item", value: "0", bar: 0 },
                  ],
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.riskShaping.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                  <p className="text-lg font-bold">{item.bar}%</p>
                </div>
              ))}
            </div>
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

      {/* Execution Blueprint */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Execution Blueprint</CardTitle>
              <CardDescription>Configure entry, stop loss, take profit, and R:R ratio</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'execution' ? null : 'execution');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'execution' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'execution' && formData ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Entry</Label>
                <Input
                  value={formData.executionBlueprint.entry}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      executionBlueprint: {
                        ...formData.executionBlueprint,
                        entry: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss</Label>
                <Input
                  value={formData.executionBlueprint.stopLoss}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      executionBlueprint: {
                        ...formData.executionBlueprint,
                        stopLoss: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Take Profit</Label>
                <Input
                  value={formData.executionBlueprint.takeProfit}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      executionBlueprint: {
                        ...formData.executionBlueprint,
                        takeProfit: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>R:R Ratio</Label>
                <Input
                  value={formData.executionBlueprint.rrRatio}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      executionBlueprint: {
                        ...formData.executionBlueprint,
                        rrRatio: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Entry</p>
                <p className="text-lg font-bold">{displayData.executionBlueprint.entry}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Stop Loss</p>
                <p className="text-lg font-bold">{displayData.executionBlueprint.stopLoss}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Take Profit</p>
                <p className="text-lg font-bold">{displayData.executionBlueprint.takeProfit}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">R:R Ratio</p>
                <p className="text-lg font-bold">{displayData.executionBlueprint.rrRatio}</p>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'execution' && formData && (
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

      {/* Live Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Management</CardTitle>
              <CardDescription>Manage live management items</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'management' ? null : 'management');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'management' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'management' && formData ? (
            <div className="space-y-4">
              {formData.liveManagement.map((item, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const updated = formData.liveManagement.map((it, i) =>
                          i === index ? { ...it, label: e.target.value } : it
                        );
                        setFormData({ ...formData, liveManagement: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input
                      value={item.status}
                      onChange={(e) => {
                        const updated = formData.liveManagement.map((it, i) =>
                          i === index ? { ...it, status: e.target.value } : it
                        );
                        setFormData({ ...formData, liveManagement: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Active</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) => {
                          const updated = formData.liveManagement.map((it, i) =>
                            i === index ? { ...it, active: e.target.checked } : it
                          );
                          setFormData({ ...formData, liveManagement: updated });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setFormData({
                        ...formData,
                        liveManagement: formData.liveManagement.filter((_, i) => i !== index),
                      });
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => {
                setFormData({
                  ...formData,
                  liveManagement: [
                    ...formData.liveManagement,
                    { label: "New Item", status: "Status", active: false },
                  ],
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.liveManagement.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                  </div>
                  <p className={item.active ? "text-primary font-bold" : "text-muted-foreground"}>
                    {item.active ? "Active" : "Inactive"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {editingSection === 'management' && formData && (
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

      {/* Final Exit Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Final Exit Report</CardTitle>
              <CardDescription>Configure exit report details</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'exit' ? null : 'exit');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'exit' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'exit' && formData ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Exit Reason</Label>
                <Input
                  value={formData.finalExitReport.exitReason}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      finalExitReport: {
                        ...formData.finalExitReport,
                        exitReason: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    value={formData.finalExitReport.rating}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        finalExitReport: {
                          ...formData.finalExitReport,
                          rating: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profit/Loss</Label>
                  <Input
                    value={formData.finalExitReport.profitLoss}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        finalExitReport: {
                          ...formData.finalExitReport,
                          profitLoss: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={formData.finalExitReport.duration}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        finalExitReport: {
                          ...formData.finalExitReport,
                          duration: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={formData.finalExitReport.notes}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      finalExitReport: {
                        ...formData.finalExitReport,
                        notes: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Exit Reason</p>
                <p className="text-lg font-bold">{displayData.finalExitReport.exitReason}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-lg font-bold">{displayData.finalExitReport.rating}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">Profit/Loss</p>
                  <p className="text-lg font-bold">{displayData.finalExitReport.profitLoss}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-bold">{displayData.finalExitReport.duration}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{displayData.finalExitReport.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'exit' && formData && (
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

