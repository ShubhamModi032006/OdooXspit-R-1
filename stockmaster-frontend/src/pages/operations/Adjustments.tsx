import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye } from "lucide-react";

const adjustments = [
  { id: "ADJ-012", product: "Tool C", warehouse: "Main", oldQty: 550, newQty: 500, reason: "Damaged stock removal", date: "2025-01-14" },
  { id: "ADJ-013", product: "Widget A", warehouse: "Main", oldQty: 1200, newQty: 1250, reason: "Count correction", date: "2025-01-15" },
];

export default function Adjustments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Adjustments</h1>
          <p className="text-muted-foreground">Manage inventory adjustments and corrections</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Adjustment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adjustment ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Old Qty</TableHead>
                <TableHead>New Qty</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adjustments.map((adj) => {
                const diff = adj.newQty - adj.oldQty;
                return (
                  <TableRow key={adj.id}>
                    <TableCell className="font-mono font-semibold">{adj.id}</TableCell>
                    <TableCell className="font-medium">{adj.product}</TableCell>
                    <TableCell>{adj.warehouse}</TableCell>
                    <TableCell>{adj.oldQty}</TableCell>
                    <TableCell>{adj.newQty}</TableCell>
                    <TableCell>
                      <span className={diff > 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                        {diff > 0 ? "+" : ""}{diff}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {adj.reason}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{adj.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
