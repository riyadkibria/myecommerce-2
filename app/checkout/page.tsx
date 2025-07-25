"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/lib/firebase.config";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", address: "", phone: "" });
  const [apiError, setApiError] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setApiError(null);
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: form.name.trim() ? "" : "Name is required",
      address: form.address.trim() ? "" : "Address is required",
      phone: form.phone.trim() ? "" : "Phone number is required",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e !== "") || cart.length === 0) {
      if (cart.length === 0) setApiError("Your cart is empty.");
      return;
    }

    if (!user) {
      setApiError("You must be logged in to place an order.");
      return;
    }

    const invoice = `INV-${Date.now()}`;
    const item_description = cart
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");

    try {
      // Save to Firestore
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        invoice,
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        total: totalPrice,
        name: form.name,
        address: form.address,
        phone: form.phone,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      // Send to Steadfast courier
      const res = await fetch("/api/steadfast/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice,
          recipient_name: form.name,
          recipient_phone: form.phone,
          recipient_address: form.address,
          cod_amount: totalPrice,
          note: `Order via website. Items: ${item_description}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Failed to place order with courier.");
        return;
      }

      clearCart();
      alert("✅ Order placed successfully!");
      setForm({ name: "", address: "", phone: "" });
    } catch (error) {
      console.error(error);
      setApiError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-4 text-sm">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium capitalize">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-blue-600">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-right text-lg font-bold text-gray-700">
                Total: <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">🚚 Shipping Info</h2>
          <form className="space-y-5">
            {["name", "address", "phone"].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium text-gray-700 mb-1 block capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  type="text"
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field as keyof typeof errors] ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={`Enter ${field}`}
                />
                {errors[field as keyof typeof errors] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}
            {apiError && <p className="text-red-600 text-sm">{apiError}</p>}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-semibold transition hover:bg-blue-700"
            >
              Confirm Order
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
