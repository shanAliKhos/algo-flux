import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { RadioIcon, Plus, Trash2, Loader2, Zap } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface DataStream {
  id?: string;
  label: string;
  active: boolean;
  delay: number;
}

export default function DataStreams() {
  const [streams, setStreams] = useState<DataStream[]>([
    { label: 'Forex Majors', active: true, delay: 0 },
    { label: 'Indices (US, EU, Asia)', active: true, delay: 200 },
    { label: 'Stocks (S&P 500)', active: true, delay: 400 },
    { label: 'Gold & Commodities', active: true, delay: 600 },
    { label: 'Crypto (BTC, ETH, Alts)', active: true, delay: 800 },
  ]);
  const [dataPointsPerSecond, setDataPointsPerSecond] = useState(2.4);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['data-streams'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ streams: DataStream[]; dataPointsPerSecond: number }>('/admin/data-streams');
        if (response) {
          setStreams(response.streams || streams);
          setDataPointsPerSecond(response.dataPointsPerSecond || 2.4);
        }
        return response;
      } catch (error) {
        return { streams, dataPointsPerSecond };
      }
    },
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { streams: DataStream[]; dataPointsPerSecond: number }) => {
      return await apiClient.post('/admin/data-streams', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-streams'] });
      toast({
        title: 'Success',
        description: 'Data streams configuration updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update configuration',
        variant: 'destructive',
      });
    },
  });

  const handleToggleStream = (index: number) => {
    const updated = streams.map((stream, i) =>
      i === index ? { ...stream, active: !stream.active } : stream
    );
    setStreams(updated);
  };

  const handleUpdateStream = (index: number, field: keyof DataStream, value: any) => {
    const updated = streams.map((stream, i) =>
      i === index ? { ...stream, [field]: value } : stream
    );
    setStreams(updated);
  };

  const handleAddStream = () => {
    setStreams([...streams, { label: 'New Stream', active: true, delay: 0 }]);
  };

  const handleRemoveStream = (index: number) => {
    setStreams(streams.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateMutation.mutate({ streams, dataPointsPerSecond });
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
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display">Data Streams</h1>
        <p className="text-muted-foreground mt-2">Manage live data streams configuration</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RadioIcon className="w-5 h-5 text-primary" />
            <CardTitle>Live Data Streams</CardTitle>
          </div>
          <CardDescription>
            Configure the data streams displayed on the frontend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {streams.map((stream, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`label-${index}`} className="text-foreground">Label</Label>
                        <Input
                          id={`label-${index}`}
                          value={stream.label}
                          onChange={(e) => handleUpdateStream(index, 'label', e.target.value)}
                          className="bg-background border-input text-foreground"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`delay-${index}`} className="text-foreground">Delay (ms)</Label>
                        <Input
                          id={`delay-${index}`}
                          type="number"
                          min="0"
                          value={stream.delay}
                          onChange={(e) => handleUpdateStream(index, 'delay', parseInt(e.target.value) || 0)}
                          className="bg-background border-input text-foreground w-24"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${index}`} className="text-foreground">Active</Label>
                        <Switch
                          id={`active-${index}`}
                          checked={stream.active}
                          onCheckedChange={() => handleToggleStream(index)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStream(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={handleAddStream}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Stream
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <CardTitle>Processing Metrics</CardTitle>
          </div>
          <CardDescription>
            Configure data processing metrics displayed on the frontend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataPoints" className="text-foreground">
                Data Points Per Second (Million)
              </Label>
              <Input
                id="dataPoints"
                type="number"
                step="0.1"
                min="0"
                value={dataPointsPerSecond}
                onChange={(e) => setDataPointsPerSecond(parseFloat(e.target.value) || 0)}
                className="bg-background border-input text-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Displayed as: Processing {dataPointsPerSecond}M data points / second
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </Button>
      </div>
    </div>
  );
}

