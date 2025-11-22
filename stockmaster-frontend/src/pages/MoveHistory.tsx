import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, ArrowRight } from "lucide-react";

const moveData = [
  { id: 1, date: "2025-01-15", product: "Widget A", category: "Electronics", fromLocation: "Main-A1-S2-B3", toLocation: "Main-B2-S1-B1", qty: 100, movedBy: "John Doe" },
  { id: 2, date: "2025-01-14", product: "Gadget B", category: "Tools", fromLocation: "Main-C1-S3-B2", toLocation: "Warehouse B-A1-S1-B1", qty: 50, movedBy: "Jane Smith" },
  { id: 3, date: "2025-01-14", product: "Part D", category: "Components", fromLocation: "Warehouse B-A2-S2-B4", toLocation: "Main-A1-S1-B5", qty: 200, movedBy: "Bob Johnson" },
  { id: 4, date: "2025-01-13", product: "Component E", category: "Electronics", fromLocation: "Main-B1-S2-B1", toLocation: "Warehouse B-C1-S1-B2", qty: 75, movedBy: "Alice Brown" },
];

export default function MoveHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Move History</h1>
        <p className="text-muted-foreground">Track internal location transfers and movements</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Movement Records</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                <TableHead>From Location</TableHead>
                <TableHead className="w-10"></TableHead>
                <TableHead>To Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Moved By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moveData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.date}</TableCell>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {item.fromLocation}
                  </TableCell>
                  <TableCell>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {item.toLocation}
                  </TableCell>
                  <TableCell className="font-semibold">{item.qty}</TableCell>
                  <TableCell>{item.movedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
