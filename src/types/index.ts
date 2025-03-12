
export type UserRole = 'client' | 'sales' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Client extends User {
  role: 'client';
  currentPackage?: InternetPackage;
  balance: number;
  topUps: TopUp[];
}

export interface Sales extends User {
  role: 'sales';
  clients: string[]; // Client IDs
  performance?: {
    clientsRegistered: number;
    salesMade: number;
  };
}

export interface Admin extends User {
  role: 'admin';
}

export interface InternetPackage {
  id: string;
  name: string;
  dataLimit: number; // In GB
  dataUsed: number; // In GB
  price: number;
  validity: number; // In days
  purchasedAt: string;
  expiresAt: string;
}

export interface TopUp {
  id: string;
  amount: number;
  date: string;
  method: 'credit_card' | 'bank_transfer' | 'online_payment';
  status: 'completed' | 'pending' | 'failed';
}

export interface PackageOption {
  id: string;
  name: string;
  dataLimit: number; // In GB
  price: number;
  validity: number; // In days
  popular?: boolean;
}
