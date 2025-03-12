
import { Client, InternetPackage, PackageOption, Sales, TopUp, User } from "@/types";

// Package options that clients can purchase
export const packageOptions: PackageOption[] = [
  {
    id: "basic",
    name: "Basic",
    dataLimit: 50,
    price: 29.99,
    validity: 30,
  },
  {
    id: "standard",
    name: "Standard",
    dataLimit: 100,
    price: 49.99,
    validity: 30,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    dataLimit: 200,
    price: 79.99,
    validity: 30,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    dataLimit: 500,
    price: 119.99,
    validity: 30,
  },
];

// Mock top-up history for clients
const generateTopUps = (count: number): TopUp[] => {
  const methods = ['credit_card', 'bank_transfer', 'online_payment'] as const;
  const statuses = ['completed', 'pending', 'failed'] as const;
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    return {
      id: `topup-${i}`,
      amount: Math.floor(Math.random() * 50) + 10,
      date: date.toISOString(),
      method: methods[Math.floor(Math.random() * methods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate clients with random internet packages
const generateClients = (count: number): Client[] => {
  return Array.from({ length: count }, (_, i) => {
    const packageOption = packageOptions[Math.floor(Math.random() * packageOptions.length)];
    const purchasedAt = new Date();
    purchasedAt.setDate(purchasedAt.getDate() - Math.floor(Math.random() * 20));
    
    const expiresAt = new Date(purchasedAt);
    expiresAt.setDate(expiresAt.getDate() + packageOption.validity);
    
    return {
      id: `client-${i}`,
      name: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      role: 'client',
      phone: `+1 555-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `${Math.floor(100 + Math.random() * 9900)} Main St, City ${i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      balance: Math.floor(Math.random() * 100) + 20,
      currentPackage: {
        id: `pkg-${i}`,
        name: packageOption.name,
        dataLimit: packageOption.dataLimit,
        dataUsed: Math.floor(Math.random() * packageOption.dataLimit),
        price: packageOption.price,
        validity: packageOption.validity,
        purchasedAt: purchasedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
      topUps: generateTopUps(Math.floor(Math.random() * 8) + 2),
    };
  });
};

// Generate sales personnel with assigned clients
const generateSales = (count: number, clientIds: string[]): Sales[] => {
  return Array.from({ length: count }, (_, i) => {
    // Distribute clients among sales staff
    const startIdx = Math.floor((i * clientIds.length) / count);
    const endIdx = Math.floor(((i + 1) * clientIds.length) / count);
    const assignedClients = clientIds.slice(startIdx, endIdx);
    
    return {
      id: `sales-${i}`,
      name: `Sales Agent ${i + 1}`,
      email: `sales${i + 1}@example.com`,
      role: 'sales',
      phone: `+1 555-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      clients: assignedClients,
      performance: {
        clientsRegistered: assignedClients.length,
        salesMade: Math.floor(Math.random() * 50) + 10,
      },
    };
  });
};

// Generate mock data
const clients = generateClients(20);
const clientIds = clients.map(client => client.id);
const sales = generateSales(5, clientIds);

const admins: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(Date.now() - 20000000000).toISOString(),
  },
];

// Demo users that can be used to log in (one for each role)
export const demoUsers = {
  client: {
    id: 'client-0',
    name: 'Demo Client',
    email: 'client@example.com',
    password: 'password123',
    role: 'client',
  },
  sales: {
    id: 'sales-0',
    name: 'Demo Sales',
    email: 'sales@example.com',
    password: 'password123',
    role: 'sales',
  },
  admin: {
    id: 'admin-1',
    name: 'Demo Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
};

// All users
export const allUsers = [...clients, ...sales, ...admins];

// Export specific user types
export const mockClients = clients;
export const mockSales = sales;
export const mockAdmins = admins;
