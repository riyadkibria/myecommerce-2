"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase.config";
import { signOut } from "firebase/auth";
import {
  LogOut,
  Package,
  History,
  Users,
  BarChart2,
  ShoppingBag,
} from "lucide-react";

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setUserEmail(user.email);
        setLoading(false);
      } else {
        router.push("/");
      }
    });

    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-600 font-medium">Loading...</p>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 font-sans relative">
      {/* Welcome message */}
      {showWelcome && (
        <div
          role="alert"
          className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut font-semibold tracking-wide"
        >
          Welcome, {userEmail ?? "User"}! 🎉
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl shadow-lg px-6 py-5 flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Logged in as <span className="font-medium">{userEmail}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          icon={<Package className="text-blue-500 w-5 h-5" />}
          title="Order Confirmations"
          desc="Manage and confirm customer orders. Add realtime data here later."
        />
        <Card
          icon={<History className="text-green-500 w-5 h-5" />}
          title="Order History"
          desc="View past orders and statuses. Filter by product, date, or user."
        />
        <Card
          icon={<ShoppingBag className="text-indigo-500 w-5 h-5" />}
          title="Products"
          desc="Manage your product catalog, pricing, and stock availability."
        />
        <Card
          icon={<Users className="text-pink-500 w-5 h-5" />}
          title="Customers"
          desc="Access customer information and communication history."
        />
        <Card
          icon={<BarChart2 className="text-yellow-500 w-5 h-5" />}
          title="Analytics"
          desc="Track sales, user activity, and business performance visually."
        />
      </main>

      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          10%,
          90% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }
        .animate-fadeInOut {
          animation: fadeInOut 5s ease forwards;
        }
      `}</style>
    </div>
  );
}

function Card({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <section className="bg-white rounded-2xl shadow hover:shadow-md transition-all p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
    </section>
  );
}
