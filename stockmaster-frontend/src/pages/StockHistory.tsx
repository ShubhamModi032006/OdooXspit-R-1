import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download } from "lucide-react";

const historyData = [
  { id: 1, date: "2025-01-15", product: "Widget A", category: "Electronics", qty: 500, type: "Stock In", supplier: "Tech Supplies Co", warehouse: "Main", reference: "RCP-001" },
  { id: 2, date: "2025-01-14", product: "Gadget B", category: "Tools", qty: -200, type: "Stock Out", supplier: "-", warehouse: "Main", reference: "DLV-045" },
  { id: 3, date: "2025-01-14", product: "Tool C", category: "Hardware", qty: -50, type: "Adjustment", supplier: "-", warehouse: "Main", reference: "ADJ-012" },
  { id: 4, date: "2025-01-13", product: "Part D", category: "Components", qty: 1000, type: "Stock In", supplier: "Parts Direct", warehouse: "Warehouse B", reference: "RCP-002" },
  { id: 5, date: "2025-01-13", product: "Component E", category: "Electronics", qty: 100, type: "Transfer", supplier: "-", warehouse: "Main → B", reference: "TRF-008" },
];

const transactionTypes = ["All", "Stock In", "Stock Out", "Transfer", "Adjustment"];

export default function StockHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock History</h1>
        <p className="text-muted-foreground">Track all inventory transactions and movements</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Transaction Ledger</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Supplier/Dept</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.date}</TableCell>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <span className={item.qty > 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                      {item.qty > 0 ? "+" : ""}{item.qty}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.supplier}</TableCell>
                  <TableCell className="text-sm">{item.warehouse}</TableCell>
                  <TableCell className="font-mono text-sm">{item.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
