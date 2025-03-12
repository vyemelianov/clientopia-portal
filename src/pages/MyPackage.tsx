
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, Download, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function MyPackage() {
  const { user } = useAuth();
  const { clients } = useData();

  if (user?.role !== "client") return null;

  const client = clients.find((c) => c.id === user.id);
  const currentPackage = client?.currentPackage;

  if (!client || !currentPackage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Internet Package</h1>
        <Card className="w-full">
          <CardContent className="pt-6 text-center">
            <p className="mb-4">You don't have an active package</p>
            <Button asChild>
              <Link to="/purchase">Purchase a Package</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dataUsedPercent = (currentPackage.dataUsed / currentPackage.dataLimit) * 100;
  const dataRemaining = currentPackage.dataLimit - currentPackage.dataUsed;
  
  const purchasedDate = new Date(currentPackage.purchasedAt);
  const expiryDate = new Date(currentPackage.expiresAt);
  
  // Calculate days remaining
  const currentDate = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - currentDate.getTime()) / msPerDay));
  
  // Data for pie chart
  const chartData = [
    { name: "Used", value: currentPackage.dataUsed },
    { name: "Remaining", value: dataRemaining },
  ];
  
  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Internet Package</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{currentPackage.name} Package</CardTitle>
            <CardDescription>
              {currentPackage.dataLimit} GB data for {currentPackage.validity} days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Data Usage ({dataUsedPercent.toFixed(1)}%)</span>
                <span>
                  {currentPackage.dataUsed.toFixed(1)} GB / {currentPackage.dataLimit} GB
                </span>
              </div>
              <Progress value={dataUsedPercent} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-4">
                <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="font-medium">{format(purchasedDate, "PPP")}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Expires on</p>
                  <p className="font-medium">
                    {format(expiryDate, "PPP")} 
                    <span className="text-sm text-muted-foreground ml-1">
                      ({daysRemaining} days left)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/purchase">Upgrade Package</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} GB`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[#8884d8] mr-2"></span>
                  Used Data
                </span>
                <span>{currentPackage.dataUsed.toFixed(1)} GB</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[#82ca9d] mr-2"></span>
                  Remaining Data
                </span>
                <span>{dataRemaining.toFixed(1)} GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
