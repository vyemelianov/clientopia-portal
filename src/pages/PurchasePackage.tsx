
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function PurchasePackage() {
  const { user } = useAuth();
  const { packageOptions, clients, purchasePackage } = useData();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  if (user?.role !== "client") return null;

  const client = clients.find((c) => c.id === user.id);

  if (!client) return null;

  const handlePurchase = () => {
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      purchasePackage(client.id, selectedPackage);
      setIsProcessing(false);
      navigate("/my-package");
    }, 1500);
  };

  const selectedPackageDetails = packageOptions.find((p) => p.id === selectedPackage);
  const sufficientBalance = selectedPackageDetails 
    ? client.balance >= selectedPackageDetails.price 
    : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Purchase Internet Package</h1>
      <p className="text-muted-foreground mb-6">
        Choose a package that best suits your needs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {packageOptions.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative overflow-hidden ${selectedPackage === pkg.id ? 'ring-2 ring-primary' : ''}`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-tl-none rounded-br-none m-0">Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>{pkg.dataLimit} GB for {pkg.validity} days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold">${pkg.price.toFixed(2)}</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>{pkg.dataLimit} GB high-speed data</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Valid for {pkg.validity} days</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>24/7 Customer Support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedPackage === pkg.id ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {selectedPackage === pkg.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPackage ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center py-2 border-b">
                <div className="space-y-1">
                  <p className="font-medium">Selected Package</p>
                  <p className="text-xl font-bold">{selectedPackageDetails?.name}</p>
                </div>
                <p className="text-xl font-bold">${selectedPackageDetails?.price.toFixed(2)}</p>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-center py-2 border-b">
                <div className="space-y-1">
                  <p className="font-medium">Account Balance</p>
                  <p className={`text-xl font-bold ${!sufficientBalance ? 'text-destructive' : ''}`}>
                    ${client.balance.toFixed(2)}
                  </p>
                </div>
                {!sufficientBalance && (
                  <Badge variant="destructive" className="md:ml-2 mt-2 md:mt-0">
                    Insufficient Balance
                  </Badge>
                )}
              </div>
              
              {!sufficientBalance && selectedPackageDetails && (
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="text-sm">
                    You need to add ${(selectedPackageDetails.price - client.balance).toFixed(2)} more to your account. 
                    <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate("/top-ups")}>
                      Top up now
                    </Button>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Wifi className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground">Select a package to continue</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            disabled={!selectedPackage || !sufficientBalance || isProcessing}
            onClick={handlePurchase}
          >
            {isProcessing ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Purchase"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
