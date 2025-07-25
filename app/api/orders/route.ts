import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  try {
    const snapshot = await db
      .collection("orders")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
