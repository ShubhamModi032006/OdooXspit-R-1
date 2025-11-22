import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, AlertTriangle, XCircle, FolderOpen, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardApi, operationsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  ready: "success",
  pending: "warning",
  late: "destructive",
  completed: "success",
  in_progress: "warning",
} as const;

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, operationsData] = await Promise.all([
        dashboardApi.getStats(),
        operationsApi.getAll(),
      ]);
      
      setStats(statsData);
      setRecentActivity(operationsData.slice(0, 5)); // Get last 5 operations
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Package className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to StockMaster Inventory System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Items"
          value={stats?.totalProducts?.toString() || "0"}
          icon={Package}
          trend={stats?.productsTrend}
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockCount?.toString() || "0"}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Out of Stock"
          value={stats?.outOfStockCount?.toString() || "0"}
          icon={XCircle}
          variant="destructive"
        />
        <StatCard
          title="Total Value"
          value={`$${stats?.totalValue?.toLocaleString() || "0"}`}
          icon={FolderOpen}
          variant="success"
        />
        <StatCard
          title="Today's Operations"
          value={stats?.todayOperations?.toString() || "0"}
          icon={ShoppingCart}
          trend={stats?.operationsTrend}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity._id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground capitalize">{activity.type}</span>
                        <Badge variant={statusColors[activity.status] || "default"}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.product?.name || activity.product?.sku || "Unknown Product"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {activity.quantity > 0 ? "+" : ""}{activity.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/operations/receipts")}
              >
                <Package className="mr-2 h-4 w-4" />
                Create Receipt
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/operations/deliveries")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create Delivery
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/operations/adjustments")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Create Adjustment
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/stock")}
              >
                <Package className="mr-2 h-4 w-4" />
                View Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
