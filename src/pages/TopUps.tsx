
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Clock, DollarSign, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function TopUps() {
  const { user } = useAuth();
  const { clients, addTopUp } = useData();
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (user?.role !== "client") return null;

  const client = clients.find((c) => c.id === user.id);

  if (!client) return null;

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      addTopUp(client.id, amount);
      setTopUpAmount("");
      setIsProcessing(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Top-ups</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top-up History</CardTitle>
            <CardDescription>
              View your recent account top-ups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Method</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.topUps.length > 0 ? (
                      client.topUps.map((topUp) => (
                        <tr key={topUp.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            {format(new Date(topUp.date), "PP")}
                          </td>
                          <td className="p-4 align-middle font-medium">
                            ${topUp.amount.toFixed(2)}
                          </td>
                          <td className="p-4 align-middle capitalize">
                            {topUp.method.replace("_", " ")}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              {getStatusIcon(topUp.status)}
                              <span className="ml-2 capitalize">{topUp.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No top-up records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>
              Top up your account balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-primary/10 p-4 flex items-center space-x-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Current Balance</p>
                <p className="text-2xl font-bold">${client.balance.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topUpAmount">Amount to add ($)</Label>
              <Input
                id="topUpAmount"
                type="number"
                min="1"
                step="any"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleTopUp}
              disabled={isProcessing || !topUpAmount || parseFloat(topUpAmount) <= 0}
            >
              {isProcessing ? "Processing..." : "Add Funds"}
            </Button>

            <p className="text-xs text-muted-foreground">
              * For demo purposes, top-ups are processed instantly without actual payment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
