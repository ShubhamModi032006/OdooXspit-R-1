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

const receipts = [
  { id: "RCP-001", supplier: "Tech Supplies Co", product: "Widget A", qty: 500, status: "ready", date: "2025-01-15" },
  { id: "RCP-002", supplier: "Parts Direct", product: "Part D", qty: 1000, status: "pending", date: "2025-01-13" },
  { id: "RCP-003", supplier: "Hardware Inc", product: "Tool C", qty: 200, status: "late", date: "2025-01-10" },
];

const statusVariants = {
  ready: "success",
  pending: "warning",
  late: "destructive",
} as const;

export default function Receipts() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
          <p className="text-muted-foreground">Manage incoming stock receipts</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Receipt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-mono font-semibold">{receipt.id}</TableCell>
                  <TableCell>{receipt.supplier}</TableCell>
                  <TableCell className="font-medium">{receipt.product}</TableCell>
                  <TableCell className="font-semibold">{receipt.qty}</TableCell>
                  <TableCell className="font-mono text-sm">{receipt.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[receipt.status]}>
                      {receipt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {receipt.status === "pending" && (
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
