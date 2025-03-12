
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function RegisterClient() {
  const navigate = useNavigate();
  const { registerClient } = useData();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    balance: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // All required fields must be filled
    if (!formData.name || !formData.email || !formData.password) {
      return;
    }

    registerClient({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      balance: formData.balance,
      role: "client",
    });

    navigate("/clients");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Register New Client</CardTitle>
          <CardDescription>Create a new client account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
              <Input
                required
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
              <Input
                required
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter client email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password *</label>
              <Input
                required
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </div>
            
            <div>
              <label htmlFor="balance" className="block text-sm font-medium mb-1">Initial Balance</label>
              <Input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleInputChange}
                placeholder="Enter initial balance"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate("/clients")}>
                Cancel
              </Button>
              <Button type="submit">Register Client</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
