import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, Trash2, Edit2, Shield } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AuditData {
  recentExecutions: Array<{
    time: string;
    strategy: string;
    symbol: string;
    direction: string;
    size: string;
    price: string;
    status: string;
  }>;
  performanceByStrategy: Array<{
    name: string;
    winRate: number;
    avgR: number;
    trades: number;
    pnl: string;
  }>;
  riskMetrics: Array<{
    label: string;
    value: string;
    status: string;
  }>;
  anomalies: Array<{
    time: string;
    type: string;
    asset: string;
    severity: string;
  }>;
  dailyAccuracy: Array<{
    day: string;
    accuracy: number;
  }>;
  complianceLogs: {
    riskCompliance: string;
    policyViolations: number;
    systemUptime: string;
    avgLatency: string;
  };
}

export default function AuditAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Fetch Audit data
  const { data, isLoading, error } = useQuery({
    queryKey: ['audit'],
    queryFn: async (): Promise<AuditData> => {
      try {
        const response = await adminApi.getAudit();
        return response;
      } catch (error: any) {
        // Return default data if API doesn't exist yet
        if (error?.message?.includes('not found')) {
          return {
            recentExecutions: [
              { time: "14:32:05", strategy: "Drav", symbol: "XAUUSD", direction: "Long", size: "0.85", price: "2,641.50", status: "Filled" },
              { time: "14:28:12", strategy: "Tenzor", symbol: "BTCUSDT", direction: "Long", size: "0.12", price: "98,245", status: "Filled" },
            ],
            performanceByStrategy: [
              { name: "Drav", winRate: 72.5, avgR: 2.1, trades: 156, pnl: "+$45,230" },
              { name: "Tenzor", winRate: 68.2, avgR: 2.8, trades: 142, pnl: "+$52,180" },
            ],
            riskMetrics: [
              { label: "Max Leverage Allowed", value: "1:50", status: "ok" },
              { label: "Current Leverage", value: "1:12", status: "ok" },
            ],
            anomalies: [
              { time: "12:45:00", type: "Volatility Spike", asset: "XAUUSD", severity: "medium" },
            ],
            dailyAccuracy: [
              { day: "Mon", accuracy: 78 },
              { day: "Tue", accuracy: 72 },
            ],
            complianceLogs: {
              riskCompliance: "100%",
              policyViolations: 0,
              systemUptime: "99.9%",
              avgLatency: "12ms",
            },
          };
        }
        throw error;
      }
    },
    refetchInterval: 30000,
  });

  // Local state for editing
  const [formData, setFormData] = useState<AuditData | null>(null);

  // Initialize form data when data loads
  useEffect(() => {
    if (data && !formData) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
    }
  }, [data, formData]);

  const updateMutation = useMutation({
    mutationFn: async (config: AuditData) => {
      return await adminApi.updateAudit(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit'] });
      toast({
        title: 'Success',
        description: 'Audit data updated successfully',
      });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update audit data',
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
          <p className="text-destructive mb-2">Error loading Audit data</p>
          <p className="text-sm text-muted-foreground">Using default configuration</p>
        </div>
      </div>
    );
  }

  const currentData = data || {
    recentExecutions: [],
    performanceByStrategy: [],
    riskMetrics: [],
    anomalies: [],
    dailyAccuracy: [],
    complianceLogs: {
      riskCompliance: "100%",
      policyViolations: 0,
      systemUptime: "99.9%",
      avgLatency: "12ms",
    },
  };

  const displayData = formData || currentData;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold">
            Audit Room <span className="text-primary text-glow">Management</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage and configure audit room settings and transparency data
        </p>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Executions</CardTitle>
              <CardDescription>Manage recent trade executions displayed in the audit room</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'executions' ? null : 'executions');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'executions' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'executions' && formData ? (
            <div className="space-y-4">
              {formData.recentExecutions.map((exec, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-7 border p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      value={exec.time}
                      onChange={(e) => {
                        const updated = [...formData.recentExecutions];
                        updated[index] = { ...exec, time: e.target.value };
                        setFormData({ ...formData, recentExecutions: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Strategy</Label>
                    <Input
                      value={exec.strategy}
                      onChange={(e) => {
                        const updated = [...formData.recentExecutions];
                        updated[index] = { ...exec, strategy: e.target.value };
                        setFormData({ ...formData, recentExecutions: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Symbol</Label>
                    <Input
                      value={exec.symbol}
                      onChange={(e) => {
                        const updated = [...formData.recentExecutions];
                        updated[index] = { ...exec, symbol: e.target.value };
                        setFormData({ ...formData, recentExecutions: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Direction</Label>
                    <Input
                      value={exec.direction}
                      onChange={(e) => {
                        const updated = [...formData.recentExecutions];
                        updated[index] = { ...exec, direction: e.target.value };
                        setFormData({ ...formData, recentExecutions: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input
                      value={exec.size}
                      onChange={(e) => {
                        const updated = [...formData.recentExecutions];
                        updated[index] = { ...exec, size: e.target.value };
                        setFormData({ ...formData, recentExecutions: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      value={exec.price}
                      onChange={(e) => {
                        const updated = [...formData.recentExecutions];
                        updated[index] = { ...exec, price: e.target.value };
                        setFormData({ ...formData, recentExecutions: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex gap-2">
                      <Input
                        value={exec.status}
                        onChange={(e) => {
                          const updated = [...formData.recentExecutions];
                          updated[index] = { ...exec, status: e.target.value };
                          setFormData({ ...formData, recentExecutions: updated });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = formData.recentExecutions.filter((_, i) => i !== index);
                          setFormData({ ...formData, recentExecutions: updated });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    recentExecutions: [
                      ...formData.recentExecutions,
                      { time: "", strategy: "", symbol: "", direction: "", size: "", price: "", status: "" },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Execution
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.recentExecutions.map((exec, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <span className="font-mono text-sm w-24">{exec.time}</span>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs w-20 text-center">{exec.strategy}</span>
                  <span className="font-medium w-24">{exec.symbol}</span>
                  <span className={cn("text-xs w-16", exec.direction === "Long" ? "text-primary" : "text-destructive")}>{exec.direction}</span>
                  <span className="font-mono text-sm w-16">{exec.size}</span>
                  <span className="font-mono text-sm w-24">{exec.price}</span>
                  <span className={cn("text-xs", exec.status === "Filled" ? "text-primary" : "text-warning")}>{exec.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {editingSection === 'executions' && formData && (
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

      {/* Performance by Strategy */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance by Strategy</CardTitle>
              <CardDescription>Configure strategy performance metrics</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'performance' ? null : 'performance');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'performance' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'performance' && formData ? (
            <div className="space-y-4">
              {formData.performanceByStrategy.map((strat, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-5 border p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={strat.name}
                      onChange={(e) => {
                        const updated = [...formData.performanceByStrategy];
                        updated[index] = { ...strat, name: e.target.value };
                        setFormData({ ...formData, performanceByStrategy: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Win Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={strat.winRate}
                      onChange={(e) => {
                        const updated = [...formData.performanceByStrategy];
                        updated[index] = { ...strat, winRate: parseFloat(e.target.value) || 0 };
                        setFormData({ ...formData, performanceByStrategy: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Avg R</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={strat.avgR}
                      onChange={(e) => {
                        const updated = [...formData.performanceByStrategy];
                        updated[index] = { ...strat, avgR: parseFloat(e.target.value) || 0 };
                        setFormData({ ...formData, performanceByStrategy: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trades</Label>
                    <Input
                      type="number"
                      value={strat.trades}
                      onChange={(e) => {
                        const updated = [...formData.performanceByStrategy];
                        updated[index] = { ...strat, trades: parseInt(e.target.value) || 0 };
                        setFormData({ ...formData, performanceByStrategy: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>P&L</Label>
                    <div className="flex gap-2">
                      <Input
                        value={strat.pnl}
                        onChange={(e) => {
                          const updated = [...formData.performanceByStrategy];
                          updated[index] = { ...strat, pnl: e.target.value };
                          setFormData({ ...formData, performanceByStrategy: updated });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = formData.performanceByStrategy.filter((_, i) => i !== index);
                          setFormData({ ...formData, performanceByStrategy: updated });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    performanceByStrategy: [
                      ...formData.performanceByStrategy,
                      { name: "", winRate: 0, avgR: 0, trades: 0, pnl: "" },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Strategy
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.performanceByStrategy.map((strat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium w-24">{strat.name}</span>
                  <span className="text-sm text-muted-foreground w-20">{strat.trades} trades</span>
                  <span className="text-sm text-primary font-mono w-24">{strat.winRate}%</span>
                  <span className="text-sm text-primary font-mono w-20">{strat.avgR}R</span>
                  <span className="text-sm font-bold text-primary w-24">{strat.pnl}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {editingSection === 'performance' && formData && (
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

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Metrics</CardTitle>
              <CardDescription>Configure risk and compliance metrics</CardDescription>
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
              {formData.riskMetrics.map((metric, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-3 border p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={metric.label}
                      onChange={(e) => {
                        const updated = [...formData.riskMetrics];
                        updated[index] = { ...metric, label: e.target.value };
                        setFormData({ ...formData, riskMetrics: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={metric.value}
                      onChange={(e) => {
                        const updated = [...formData.riskMetrics];
                        updated[index] = { ...metric, value: e.target.value };
                        setFormData({ ...formData, riskMetrics: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex gap-2">
                      <Input
                        value={metric.status}
                        onChange={(e) => {
                          const updated = [...formData.riskMetrics];
                          updated[index] = { ...metric, status: e.target.value };
                          setFormData({ ...formData, riskMetrics: updated });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = formData.riskMetrics.filter((_, i) => i !== index);
                          setFormData({ ...formData, riskMetrics: updated });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    riskMetrics: [
                      ...formData.riskMetrics,
                      { label: "", value: "", status: "ok" },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayData.riskMetrics.map((metric, index) => (
                <div key={index} className="p-3 rounded-lg bg-card border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    <span className={cn(
                      "text-xs",
                      metric.status === "ok" ? "text-primary" : "text-warning"
                    )}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="font-mono font-bold">{metric.value}</div>
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

      {/* Anomalies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Market Anomalies</CardTitle>
              <CardDescription>Configure detected market anomalies</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'anomalies' ? null : 'anomalies');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'anomalies' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'anomalies' && formData ? (
            <div className="space-y-4">
              {formData.anomalies.map((anomaly, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-4 border p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      value={anomaly.time}
                      onChange={(e) => {
                        const updated = [...formData.anomalies];
                        updated[index] = { ...anomaly, time: e.target.value };
                        setFormData({ ...formData, anomalies: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input
                      value={anomaly.type}
                      onChange={(e) => {
                        const updated = [...formData.anomalies];
                        updated[index] = { ...anomaly, type: e.target.value };
                        setFormData({ ...formData, anomalies: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Asset</Label>
                    <Input
                      value={anomaly.asset}
                      onChange={(e) => {
                        const updated = [...formData.anomalies];
                        updated[index] = { ...anomaly, asset: e.target.value };
                        setFormData({ ...formData, anomalies: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <div className="flex gap-2">
                      <Input
                        value={anomaly.severity}
                        onChange={(e) => {
                          const updated = [...formData.anomalies];
                          updated[index] = { ...anomaly, severity: e.target.value };
                          setFormData({ ...formData, anomalies: updated });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = formData.anomalies.filter((_, i) => i !== index);
                          setFormData({ ...formData, anomalies: updated });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    anomalies: [
                      ...formData.anomalies,
                      { time: "", type: "", asset: "", severity: "low" },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Anomaly
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    anomaly.severity === "high" ? "bg-destructive/10 border-destructive/30" :
                    anomaly.severity === "medium" ? "bg-warning/10 border-warning/30" :
                    "bg-muted/20 border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm font-medium">{anomaly.type}</div>
                      <div className="text-xs text-muted-foreground">{anomaly.asset}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{anomaly.time}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {editingSection === 'anomalies' && formData && (
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

      {/* Daily Accuracy */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Accuracy</CardTitle>
              <CardDescription>Configure daily accuracy tracking data</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'accuracy' ? null : 'accuracy');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'accuracy' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'accuracy' && formData ? (
            <div className="space-y-4">
              {formData.dailyAccuracy.map((day, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-2 border p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Input
                      value={day.day}
                      onChange={(e) => {
                        const updated = [...formData.dailyAccuracy];
                        updated[index] = { ...day, day: e.target.value };
                        setFormData({ ...formData, dailyAccuracy: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accuracy (%)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={day.accuracy}
                        onChange={(e) => {
                          const updated = [...formData.dailyAccuracy];
                          updated[index] = { ...day, accuracy: parseFloat(e.target.value) || 0 };
                          setFormData({ ...formData, dailyAccuracy: updated });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = formData.dailyAccuracy.filter((_, i) => i !== index);
                          setFormData({ ...formData, dailyAccuracy: updated });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    dailyAccuracy: [
                      ...formData.dailyAccuracy,
                      { day: "", accuracy: 0 },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Day
              </Button>
            </div>
          ) : (
            <div className="flex items-end justify-between h-32 gap-2">
              {displayData.dailyAccuracy.map((day, index) => {
                const barHeightPercent = Math.max(day.accuracy, day.accuracy === 0 ? 2 : 4);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    {/* Percentage label above bar */}
                    <span className="text-xs font-medium text-primary mb-1">
                      {day.accuracy > 0 ? `${day.accuracy}%` : ''}
                    </span>
                    {/* Bar */}
                    <div className="relative w-full h-full flex items-end">
                      <div
                        className="w-full rounded-t bg-primary/60 transition-all hover:bg-primary"
                        style={{ height: `${barHeightPercent}%`, minHeight: '2px' }}
                      />
                    </div>
                    {/* Day label below bar */}
                    <span className="text-xs text-muted-foreground mt-1">{day.day}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        {editingSection === 'accuracy' && formData && (
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

      {/* Compliance Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Logs</CardTitle>
              <CardDescription>Configure compliance metrics and statistics</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!formData) {
                  setFormData(JSON.parse(JSON.stringify(currentData)));
                }
                setEditingSection(editingSection === 'compliance' ? null : 'compliance');
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingSection === 'compliance' ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'compliance' && formData ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Risk Compliance (%)</Label>
                <Input
                  value={formData.complianceLogs.riskCompliance}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      complianceLogs: { ...formData.complianceLogs, riskCompliance: e.target.value },
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Policy Violations</Label>
                <Input
                  type="number"
                  value={formData.complianceLogs.policyViolations}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      complianceLogs: { ...formData.complianceLogs, policyViolations: parseInt(e.target.value) || 0 },
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>System Uptime (%)</Label>
                <Input
                  value={formData.complianceLogs.systemUptime}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      complianceLogs: { ...formData.complianceLogs, systemUptime: e.target.value },
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Avg Latency</Label>
                <Input
                  value={formData.complianceLogs.avgLatency}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      complianceLogs: { ...formData.complianceLogs, avgLatency: e.target.value },
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="text-2xl font-bold text-primary">{displayData.complianceLogs.riskCompliance}</div>
                <div className="text-xs text-muted-foreground">Risk Compliance</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="text-2xl font-bold text-primary">{displayData.complianceLogs.policyViolations}</div>
                <div className="text-xs text-muted-foreground">Policy Violations</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="text-2xl font-bold text-primary">{displayData.complianceLogs.systemUptime}</div>
                <div className="text-xs text-muted-foreground">System Uptime</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="text-2xl font-bold text-primary">{displayData.complianceLogs.avgLatency}</div>
                <div className="text-xs text-muted-foreground">Avg Latency</div>
              </div>
            </div>
          )}
        </CardContent>
        {editingSection === 'compliance' && formData && (
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

