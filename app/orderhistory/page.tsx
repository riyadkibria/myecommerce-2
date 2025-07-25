"use client";

import OrderHistory from "@/components/OrderHistory";

export default function OrderHistoryPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Your Order History</h1>
      <OrderHistory />
    </main>
  );
}
