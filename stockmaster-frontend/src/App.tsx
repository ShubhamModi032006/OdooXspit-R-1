import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WarehouseSetup from "./pages/WarehouseSetup";
import StockList from "./pages/StockList";
import StockHistory from "./pages/StockHistory";
import MoveHistory from "./pages/MoveHistory";
import Settings from "./pages/Settings";
import Receipts from "./pages/operations/Receipts";
import Deliveries from "./pages/operations/Deliveries";
import Adjustments from "./pages/operations/Adjustments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/warehouse-setup"
              element={
                <ProtectedRoute>
                  <WarehouseSetup />
                </ProtectedRoute>
              }
            />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/stock" element={<StockList />} />
              <Route path="/history" element={<StockHistory />} />
              <Route path="/moves" element={<MoveHistory />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/operations/receipts" element={<Receipts />} />
              <Route path="/operations/deliveries" element={<Deliveries />} />
              <Route path="/operations/adjustments" element={<Adjustments />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
