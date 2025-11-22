import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, CheckCircle } from "lucide-react";

const deliveries = [
  { id: "DLV-045", customer: "ABC Corp", product: "Gadget B", qty: 200, status: "ready", date: "2025-01-14" },
  { id: "DLV-046", customer: "XYZ Ltd", product: "Widget A", qty: 150, status: "pending", date: "2025-01-15" },
  { id: "DLV-047", customer: "Tech Solutions", product: "Component E", qty: 100, status: "late", date: "2025-01-12" },
];

const statusVariants = {
  ready: "success",
  pending: "warning",
  late: "destructive",
} as const;

export default function Deliveries() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deliveries</h1>
          <p className="text-muted-foreground">Manage outgoing deliveries</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Delivery
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-mono font-semibold">{delivery.id}</TableCell>
                  <TableCell>{delivery.customer}</TableCell>
                  <TableCell className="font-medium">{delivery.product}</TableCell>
                  <TableCell className="font-semibold">{delivery.qty}</TableCell>
                  <TableCell className="font-mono text-sm">{delivery.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[delivery.status]}>
                      {delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {delivery.status === "pending" && (
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
