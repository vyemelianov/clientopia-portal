
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BarChart, Users, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

export default function SalesTeam() {
  const { user } = useAuth();
  const { sales, clients } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  if (user?.role !== "admin") return null;

  // Filter by search term
  const filteredSales = searchTerm
    ? sales.filter(
        agent =>
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sales;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Team Management</h1>
          <p className="text-muted-foreground">
            {filteredSales.length} sales agents in your team
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales agents..."
            className="pl-8 w-full md:w-[250px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSales.length > 0 ? (
          filteredSales.map(agent => {
            // Calculate the number of clients
            const clientCount = agent.clients.length;
            
            return (
              <Card key={agent.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                    <Badge variant="secondary">Sales Agent</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{agent.email}</span>
                    </div>
                    {agent.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{agent.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 space-y-2 border-t">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Managed Clients</span>
                      </div>
                      <span className="font-medium">{clientCount}</span>
                    </div>

                    {agent.performance && (
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <BarChart className="h-4 w-4 mr-2" />
                          <span>Total Sales</span>
                        </div>
                        <span className="font-medium">{agent.performance.salesMade}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Team Member Since</span>
                      </div>
                      <span className="font-medium">
                        {format(new Date(agent.createdAt), "MMM yyyy")}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Edit Agent Details
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No sales agents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
