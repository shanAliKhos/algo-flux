import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display">Welcome Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Admin Panel</CardTitle>
            <CardDescription>Welcome to the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use this panel to manage your application settings and configurations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
