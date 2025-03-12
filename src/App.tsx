
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyPackage from "./pages/MyPackage";
import TopUps from "./pages/TopUps";
import PurchasePackage from "./pages/PurchasePackage";
import Clients from "./pages/Clients";
import RegisterClient from "./pages/RegisterClient";
import SalesTeam from "./pages/SalesTeam";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Routes */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Client Routes */}
                <Route path="/my-package" element={<MyPackage />} />
                <Route path="/top-ups" element={<TopUps />} />
                <Route path="/purchase" element={<PurchasePackage />} />
                
                {/* Sales & Admin Routes */}
                <Route path="/clients" element={<Clients />} />
                
                {/* Sales Routes */}
                <Route path="/register-client" element={<RegisterClient />} />
                
                {/* Admin Routes */}
                <Route path="/sales" element={<SalesTeam />} />
              </Route>
              
              {/* Redirect to dashboard if authenticated or login if not */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
