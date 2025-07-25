"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
  name?: string;
  quantity?: number;
  price?: number;
}

interface Order {
  id: string;
  invoice: string;
  address: string;
  items: OrderItem[];
  name: string;
  phone: string;
  status: string;
  total: number;
  createdAt: {
    _seconds: number;
  };
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    fetch(`/api/orders?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Failed to load orders.");
          setOrders([]);
        } else {
          setOrders(data);
        }
      })
      .catch(() => {
        setError("Failed to load orders.");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="text-center text-gray-500">Loading your orders...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="text-center text-gray-500">You have no orders yet.</p>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Your Order History</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Invoice",
                "Name",
                "Phone",
                "Address",
                "Items",
                "Total ($)",
                "Status",
                "Date",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-700 tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.invoice}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{order.phone}</td>
                <td className="px-5 py-4 max-w-xs whitespace-normal text-sm text-gray-700">{order.address}</td>

                <td className="px-5 py-4 max-w-md whitespace-normal text-sm text-gray-700">
                  {order.items.length === 0 ? (
                    <em>No items</em>
                  ) : (
                    order.items.map((item, i) => (
                      <div key={i} className="mb-1">
                        <span className="font-semibold">{item.name || "Unnamed"}</span>{" "}
                        × {item.quantity ?? 1}{" "}
                        <span className="text-gray-500">(${item.price?.toFixed(2) ?? "0.00"})</span>
                      </div>
                    ))
                  )}
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.total.toFixed(2)}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{order.status}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(order.createdAt._seconds * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
