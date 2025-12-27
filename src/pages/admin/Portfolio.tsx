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
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Loader2, Save, Plus, Trash2, X } from 'lucide-react';
import { adminApi, apiClient } from '@/lib/api';

interface PortfolioData {
  topStats: {
    totalEquity: string;
    totalEquityChange?: number;
    mtdReturn: string;
    maxDrawdown: string;
    sharpeRatio: string;
  };
  equityData: number[];
  drawdownData: number[];
  maxDrawdownValue: number;
  exposureTiles: Array<{
    category: string;
    allocation: number;
    pnl: number;
  }>;
  regionExposure: Array<{
    region: string;
    allocation: number;
  }>;
  riskBuckets: Array<{
    name: string;
    allocation: number;
    strategies: string[];
  }>;
}

const defaultPortfolioData: PortfolioData = {
  topStats: {
    totalEquity: "$247,892",
    totalEquityChange: 2.4,
    mtdReturn: "+8.4%",
    maxDrawdown: "-3.2%",
    sharpeRatio: "2.8",
  },
  equityData: Array.from({ length: 60 }, (_, i) => 100000 + Math.sin(i / 8) * 3000 + i * 200),
  drawdownData: Array.from({ length: 60 }, (_, i) => Math.max(0, -Math.sin(i / 10) * 4)),
  maxDrawdownValue: -3.2,
  exposureTiles: [
    { category: "Forex", allocation: 28, pnl: 4250 },
    { category: "Indices", allocation: 22, pnl: 3120 },
    { category: "Stocks", allocation: 20, pnl: 1890 },
    { category: "Crypto", allocation: 18, pnl: 5420 },
    { category: "Gold", allocation: 12, pnl: 2340 },
  ],
  regionExposure: [
    { region: "US", allocation: 55 },
    { region: "Europe", allocation: 25 },
    { region: "Asia", allocation: 15 },
    { region: "EM", allocation: 5 },
  ],
  riskBuckets: [
    { name: "Conservative", allocation: 40, strategies: ["Yark", "Xylo"] },
    { name: "Balanced", allocation: 35, strategies: ["Nuvex", "Omnix"] },
    { name: "Aggressive", allocation: 25, strategies: ["Drav", "Tenzor"] },
  ],
};

const assetCategories = [
  'Forex',
  'Crypto',
  'Stocks',
  'Gold',
  'Indices',
  'Commodities',
  'Bonds',
  'Currencies',
];

const regions = [
  'US',
  'Europe',
  'Asia',
  'EM',
  'Americas',
  'APAC',
  'Middle East',
  'Africa',
];

interface Strategy {
  id?: string;
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
}

export default function PortfolioAdmin() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      try {
        const response = await adminApi.getPortfolio();
        if (response) {
          setPortfolioData(response);
        }
        return response;
      } catch (error) {
        return portfolioData;
      }
    },
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PortfolioData) => {
      return await adminApi.updatePortfolio(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: 'Success',
        description: 'Portfolio updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update portfolio',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(portfolioData);
  };

  const handleUpdateTopStats = (field: keyof PortfolioData['topStats'], value: string | number) => {
    setPortfolioData({
      ...portfolioData,
      topStats: {
        ...portfolioData.topStats,
        [field]: value,
      },
    });
  };

  const handleUpdateEquityData = (value: string) => {
    const numbers = value.split(',').map(v => parseFloat(v.trim())).filter(n => !isNaN(n));
    setPortfolioData({
      ...portfolioData,
      equityData: numbers,
    });
  };

  const handleUpdateDrawdownData = (value: string) => {
    const numbers = value.split(',').map(v => parseFloat(v.trim())).filter(n => !isNaN(n));
    setPortfolioData({
      ...portfolioData,
      drawdownData: numbers,
    });
  };

  const handleUpdateExposureTile = (index: number, field: string, value: string | number) => {
    const updated = portfolioData.exposureTiles.map((tile, i) =>
      i === index ? { ...tile, [field]: value } : tile
    );
    setPortfolioData({
      ...portfolioData,
      exposureTiles: updated,
    });
  };

  const handleAddExposureTile = () => {
    setPortfolioData({
      ...portfolioData,
      exposureTiles: [...portfolioData.exposureTiles, { category: "New", allocation: 0, pnl: 0 }],
    });
  };

  const handleRemoveExposureTile = (index: number) => {
    setPortfolioData({
      ...portfolioData,
      exposureTiles: portfolioData.exposureTiles.filter((_, i) => i !== index),
    });
  };

  const handleUpdateRegionExposure = (index: number, field: string, value: string | number) => {
    const updated = portfolioData.regionExposure.map((region, i) =>
      i === index ? { ...region, [field]: value } : region
    );
    setPortfolioData({
      ...portfolioData,
      regionExposure: updated,
    });
  };

  const handleAddRegionExposure = () => {
    setPortfolioData({
      ...portfolioData,
      regionExposure: [...portfolioData.regionExposure, { region: "New", allocation: 0 }],
    });
  };

  const handleRemoveRegionExposure = (index: number) => {
    setPortfolioData({
      ...portfolioData,
      regionExposure: portfolioData.regionExposure.filter((_, i) => i !== index),
    });
  };

  const handleUpdateRiskBucket = (index: number, field: string, value: string | number | string[]) => {
    const updated = portfolioData.riskBuckets.map((bucket, i) =>
      i === index ? { ...bucket, [field]: value } : bucket
    );
    setPortfolioData({
      ...portfolioData,
      riskBuckets: updated,
    });
  };

  const handleUpdateRiskBucketStrategies = (index: number, value: string) => {
    const strategies = value.split(',').map(s => s.trim()).filter(Boolean);
    handleUpdateRiskBucket(index, 'strategies', strategies);
  };

  const handleAddRiskBucket = () => {
    setPortfolioData({
      ...portfolioData,
      riskBuckets: [...portfolioData.riskBuckets, { name: "New", allocation: 0, strategies: [] }],
    });
  };

  const handleRemoveRiskBucket = (index: number) => {
    setPortfolioData({
      ...portfolioData,
      riskBuckets: portfolioData.riskBuckets.filter((_, i) => i !== index),
    });
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
          <h1 className="text-3xl font-bold text-foreground font-display">Portfolio</h1>
          <p className="text-muted-foreground mt-2">Manage portfolio configuration</p>
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

      {/* Top Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Top Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Equity</Label>
              <Input
                value={portfolioData.topStats.totalEquity}
                onChange={(e) => handleUpdateTopStats('totalEquity', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Equity Change (%)</Label>
              <Input
                type="number"
                value={portfolioData.topStats.totalEquityChange || 0}
                onChange={(e) => handleUpdateTopStats('totalEquityChange', parseFloat(e.target.value) || 0)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>MTD Return</Label>
              <Input
                value={portfolioData.topStats.mtdReturn}
                onChange={(e) => handleUpdateTopStats('mtdReturn', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Drawdown</Label>
              <Input
                value={portfolioData.topStats.maxDrawdown}
                onChange={(e) => handleUpdateTopStats('maxDrawdown', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>Sharpe Ratio</Label>
              <Input
                value={portfolioData.topStats.sharpeRatio}
                onChange={(e) => handleUpdateTopStats('sharpeRatio', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Drawdown Value</Label>
              <Input
                type="number"
                value={portfolioData.maxDrawdownValue}
                onChange={(e) => setPortfolioData({ ...portfolioData, maxDrawdownValue: parseFloat(e.target.value) || 0 })}
                className="bg-background border-input text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equity Data */}
      <Card>
        <CardHeader>
          <CardTitle>Equity Data</CardTitle>
          <CardDescription>Comma-separated numbers for equity curve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Equity Data (comma-separated)</Label>
            <Input
              value={portfolioData.equityData.join(', ')}
              onChange={(e) => handleUpdateEquityData(e.target.value)}
              className="bg-background border-input text-foreground"
              placeholder="100000, 100200, 100400..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Drawdown Data */}
      <Card>
        <CardHeader>
          <CardTitle>Drawdown Data</CardTitle>
          <CardDescription>Comma-separated numbers for drawdown strip</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Drawdown Data (comma-separated)</Label>
            <Input
              value={portfolioData.drawdownData.join(', ')}
              onChange={(e) => handleUpdateDrawdownData(e.target.value)}
              className="bg-background border-input text-foreground"
              placeholder="0, -0.5, -1.2..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Exposure Tiles */}
      <Card>
        <CardHeader>
          <CardTitle>Exposure Tiles (By Asset Class)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {portfolioData.exposureTiles.map((tile, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Tile {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExposureTile(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={tile.category}
                    onValueChange={(value) => handleUpdateExposureTile(index, 'category', value)}
                  >
                    <SelectTrigger className="bg-background border-input text-foreground">
                      <SelectValue placeholder="Select category" />
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
                <div className="space-y-2">
                  <Label>Allocation (%)</Label>
                  <Input
                    type="number"
                    value={tile.allocation}
                    onChange={(e) => handleUpdateExposureTile(index, 'allocation', parseFloat(e.target.value) || 0)}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>PnL</Label>
                  <Input
                    type="number"
                    value={tile.pnl}
                    onChange={(e) => handleUpdateExposureTile(index, 'pnl', parseFloat(e.target.value) || 0)}
                    className="bg-background border-input text-foreground"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddExposureTile} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Exposure Tile
          </Button>
        </CardContent>
      </Card>

      {/* Region Exposure */}
      <Card>
        <CardHeader>
          <CardTitle>Region Exposure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {portfolioData.regionExposure.map((region, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Region {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRegionExposure(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select
                    value={region.region}
                    onValueChange={(value) => handleUpdateRegionExposure(index, 'region', value)}
                  >
                    <SelectTrigger className="bg-background border-input text-foreground">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Allocation (%)</Label>
                  <Input
                    type="number"
                    value={region.allocation}
                    onChange={(e) => handleUpdateRegionExposure(index, 'allocation', parseFloat(e.target.value) || 0)}
                    className="bg-background border-input text-foreground"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddRegionExposure} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Region
          </Button>
        </CardContent>
      </Card>

      {/* Risk Buckets */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Buckets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {portfolioData.riskBuckets.map((bucket, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Bucket {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRiskBucket(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={bucket.name}
                    onChange={(e) => handleUpdateRiskBucket(index, 'name', e.target.value)}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allocation (%)</Label>
                  <Input
                    type="number"
                    value={bucket.allocation}
                    onChange={(e) => handleUpdateRiskBucket(index, 'allocation', parseFloat(e.target.value) || 0)}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Strategies (comma-separated)</Label>
                  <Input
                    value={bucket.strategies.join(', ')}
                    onChange={(e) => handleUpdateRiskBucketStrategies(index, e.target.value)}
                    className="bg-background border-input text-foreground"
                    placeholder="Yark, Xylo"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddRiskBucket} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Risk Bucket
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

