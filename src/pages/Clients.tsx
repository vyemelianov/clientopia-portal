
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Package, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Clients() {
  const { user } = useAuth();
  const { clients, sales } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user || (user.role !== "sales" && user.role !== "admin")) return null;

  // For sales users, filter clients assigned to them
  let clientList = clients;
  if (user.role === "sales") {
    const salesUser = sales.find(s => s.id === user.id);
    if (salesUser) {
      clientList = clients.filter(client => salesUser.clients.includes(client.id));
    }
  }

  // Filter by search term
  const filteredClients = searchTerm
    ? clientList.filter(
        client =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : clientList;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Client Management</h1>
          <p className="text-muted-foreground">
            {filteredClients.length} clients {user.role === "sales" ? "assigned to you" : "total"}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {user.role === "sales" && (
            <Button asChild>
              <Link to="/register-client">Add Client</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <Card key={client.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <Badge variant="outline">Client</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-2 border-t">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Package className="h-4 w-4 mr-2" />
                      <span>Current Package</span>
                    </div>
                    <span className="font-medium">
                      {client.currentPackage?.name || "None"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Customer Since</span>
                    </div>
                    <span className="font-medium">
                      {format(new Date(client.createdAt), "MMM yyyy")}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No clients found</p>
          </div>
        )}
      </div>
    </div>
  );
}
