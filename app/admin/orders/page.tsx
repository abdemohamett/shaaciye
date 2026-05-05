'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  totalAmount: string;
  createdAt: string;
  notes: string;
  items: {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: string;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastOrderCount, setLastOrderCount] = useState(0);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (res.ok) {
        // Update the order status in the local state
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as Order['status'] }
            : order
        ));
      } else {
        const errorData = await res.json();
        console.error('Failed to update order status:', errorData);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders...');
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
          const data = await res.json();
          console.log('Orders fetched:', data.length);
          setOrders(data);
          setLastOrderCount(data.length);
        } else {
          console.error('Failed to fetch orders:', res.status);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrders();

    // Set up polling for real-time updates (every 2 seconds for faster updates)
    const interval = setInterval(() => {
      fetchOrders();
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const filteredOrders = orders.filter((order) => {
    return order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="text-gray-600">Loading orders...</span>
          </div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      Order #{order.id}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{order.customerName}</span>
                    </div>
                  </div>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Pending</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="processing" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Processing</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="shipped" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Shipped</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="delivered" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Delivered</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="text-gray-900">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="text-gray-900">{order.customerPhone}</span>
                    </div>
                    {order.notes && (
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-700">Address:</span>
                        <span className="text-gray-900">{order.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-1">Order Items ({order.items.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">{item.name}</div>
                          <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                          <div className="text-xs font-medium text-gray-900">${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-2">
                  <div className="text-lg font-bold text-gray-900">Total: ${parseFloat(order.totalAmount).toFixed(2)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchQuery ? 'No orders found' : 'No orders available'}
          </div>
        </div>
      )}
    </div>
  );
}
