
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, DollarSign, Package, Wifi } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { clients, sales } = useData();
  
  if (!user) return null;

  // Get client-specific data if user is a client
  const clientData = user.role === "client" 
    ? clients.find(client => client.id === user.id) 
    : null;

  // Get sales-specific data if user is a sales person
  const salesData = user.role === "sales" 
    ? sales.find(s => s.id === user.id) 
    : null;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Client-specific cards */}
        {user.role === "client" && clientData && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">${clientData.balance.toFixed(2)}</div>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available for purchasing packages</p>
              </CardContent>
            </Card>
            
            {clientData.currentPackage && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{clientData.currentPackage.name}</div>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Data usage</span>
                      <span>{clientData.currentPackage.dataUsed} GB / {clientData.currentPackage.dataLimit} GB</span>
                    </div>
                    <Progress 
                      value={(clientData.currentPackage.dataUsed / clientData.currentPackage.dataLimit) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Sales-specific cards */}
        {user.role === "sales" && salesData && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">My Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{salesData.clients.length}</div>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total active clients</p>
              </CardContent>
            </Card>
            
            {salesData.performance && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{salesData.performance.salesMade}</div>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total sales made</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Admin-specific cards */}
        {user.role === "admin" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Registered clients</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sales Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{sales.length}</div>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active sales personnel</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
