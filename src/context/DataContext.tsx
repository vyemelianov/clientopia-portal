
import { mockClients, mockSales, packageOptions } from "@/data/mockData";
import { Client, InternetPackage, PackageOption, Sales, TopUp, User } from "@/types";
import { createContext, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface DataContextType {
  clients: Client[];
  sales: Sales[];
  packageOptions: PackageOption[];
  getClientById: (id: string) => Client | undefined;
  getSalesById: (id: string) => Sales | undefined;
  updateClientProfile: (clientId: string, data: Partial<Client>) => void;
  purchasePackage: (clientId: string, packageId: string) => void;
  addTopUp: (clientId: string, amount: number) => void;
  registerClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'topUps'> & { password: string }) => void;
  updateSales: (salesId: string, data: Partial<Sales>) => void;
}

const DataContext = createContext<DataContextType>({
  clients: [],
  sales: [],
  packageOptions: [],
  getClientById: () => undefined,
  getSalesById: () => undefined,
  updateClientProfile: () => {},
  purchasePackage: () => {},
  addTopUp: () => {},
  registerClient: () => {},
  updateSales: () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [sales, setSales] = useState<Sales[]>(mockSales);
  const { toast } = useToast();

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const getSalesById = (id: string) => {
    return sales.find(sales => sales.id === id);
  };

  const updateClientProfile = (clientId: string, data: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === clientId ? { ...client, ...data } : client
      )
    );
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const purchasePackage = (clientId: string, packageId: string) => {
    const packageOption = packageOptions.find(pkg => pkg.id === packageId);
    if (!packageOption) return;

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + packageOption.validity);

    const newPackage: InternetPackage = {
      id: `pkg-${Date.now()}`,
      name: packageOption.name,
      dataLimit: packageOption.dataLimit,
      dataUsed: 0,
      price: packageOption.price,
      validity: packageOption.validity,
      purchasedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? {
              ...client,
              currentPackage: newPackage,
              balance: client.balance - packageOption.price,
            }
          : client
      )
    );

    toast({
      title: "Package purchased",
      description: `You have successfully purchased the ${packageOption.name} package`,
    });
  };

  const addTopUp = (clientId: string, amount: number) => {
    const now = new Date();
    
    const newTopUp: TopUp = {
      id: `topup-${Date.now()}`,
      amount,
      date: now.toISOString(),
      method: 'credit_card',
      status: 'completed',
    };

    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? {
              ...client,
              balance: client.balance + amount,
              topUps: [newTopUp, ...client.topUps],
            }
          : client
      )
    );

    toast({
      title: "Top-up successful",
      description: `Your account has been topped up with $${amount}`,
    });
  };

  const registerClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'topUps'> & { password: string }) => {
    const { password, ...clientWithoutPassword } = clientData;
    
    const newClient: Client = {
      ...clientWithoutPassword,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      topUps: [],
      balance: clientData.balance || 0,
    };

    setClients(prev => [...prev, newClient]);

    toast({
      title: "Client registered",
      description: `New client ${newClient.name} has been registered successfully`,
    });
  };

  const updateSales = (salesId: string, data: Partial<Sales>) => {
    setSales(prev =>
      prev.map(sales =>
        sales.id === salesId ? { ...sales, ...data } : sales
      )
    );
    
    toast({
      title: "Sales profile updated",
      description: "Sales profile has been updated successfully",
    });
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        sales,
        packageOptions,
        getClientById,
        getSalesById,
        updateClientProfile,
        purchasePackage,
        addTopUp,
        registerClient,
        updateSales,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
