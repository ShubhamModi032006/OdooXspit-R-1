import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse as WarehouseIcon, Plus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { warehouseApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function WarehouseSetup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
  });
  const [warehouseName, setWarehouseName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isManager = user?.role === "manager";
  const isStaff = user?.role === "staff";

  useEffect(() => {
    if (isManager) {
      fetchWarehouses();
    } else {
      setLoading(false);
    }
  }, [isManager]);

  const fetchWarehouses = async () => {
    try {
      const data = await warehouseApi.getAll();
      setWarehouses(data);
      setShowCreateForm(data.length === 0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch warehouses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await warehouseApi.create(formData.name, formData.code.toUpperCase(), formData.location);
      toast({
        title: "Success",
        description: "Warehouse created successfully!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create warehouse",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!warehouseName) {
      toast({
        title: "Error",
        description: "Please enter a warehouse name",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await warehouseApi.join(warehouseName);
      toast({
        title: "Success",
        description: "Successfully joined warehouse!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join warehouse. Please check the name.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectWarehouse = (warehouseId: string) => {
    localStorage.setItem('selectedWarehouse', warehouseId);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex w-full items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Package className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">StockMaster</span>
            </div>
            <h1 className="text-3xl font-bold">Warehouse Setup</h1>
            <p className="text-muted-foreground">
              {isManager && warehouses.length === 0 && "Create your first warehouse to get started"}
              {isManager && warehouses.length > 0 && "Select a warehouse or create a new one"}
              {isStaff && "Enter the warehouse name provided by your manager"}
            </p>
          </div>

          {/* Manager View - Existing Warehouses */}
          {isManager && warehouses.length > 0 && !showCreateForm && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {warehouses.map((warehouse) => (
                  <Card
                    key={warehouse._id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelectWarehouse(warehouse._id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <WarehouseIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                          <CardDescription>{warehouse.code}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Warehouse
                </Button>
              </div>
            </div>
          )}

          {/* Manager View - Create Warehouse Form */}
          {isManager && showCreateForm && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Create Warehouse</CardTitle>
                <CardDescription>
                  Enter the details for your new warehouse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateWarehouse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Warehouse Name</Label>
                    <Input
                      id="name"
                      placeholder="Main Warehouse"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Warehouse Code</Label>
                    <Input
                      id="code"
                      placeholder="WH001"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Share this code with staff members to let them join
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="123 Main St, City, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={submitting}>
                      {submitting ? "Creating..." : "Create Warehouse"}
                    </Button>
                    {warehouses.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Staff View - Join Warehouse */}
          {isStaff && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Join Warehouse</CardTitle>
                    <CardDescription>
                      Enter the warehouse name provided by your manager
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinWarehouse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="warehouseName">Warehouse Name</Label>
                    <Input
                      id="warehouseName"
                      placeholder="Enter warehouse name (e.g., Main Warehouse)"
                      value={warehouseName}
                      onChange={(e) => setWarehouseName(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Ask your manager for the exact warehouse name
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Joining..." : "Join Warehouse"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
