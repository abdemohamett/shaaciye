'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Smartphone } from 'lucide-react';
import Image from 'next/image';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutDialog({ isOpen, onClose }: CheckoutDialogProps) {
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
  });

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        totalAmount: totalAmount,
        notes: customerInfo.address,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const order = await res.json();
        clearCart();
        onClose();
        setCustomerInfo({ name: '', phone: '', address: '' });
        alert(`Order #${order.id} placed successfully!`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while placing your order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Checkout
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  <div className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* EVC Plus Payment */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/evc.png"
                alt="EVC Plus"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h4 className="font-semibold text-green-800 text-sm">Pay with EVC Plus</h4>
                <p className="text-xs text-green-600">Send money to this number to complete your order</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">EVC Number:</span>
              </div>
              <span className="text-lg font-bold text-green-700">+252 61 234 5678</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={handleInputChange('name')}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="+1234567890"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={handleInputChange('address')}
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
