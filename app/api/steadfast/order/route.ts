import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://portal.packzy.com/api/v1/create_order';

// Replace with your actual API keys (keep secret, use env vars!)
const API_KEY = process.env.STEADFAST_API_KEY || 'your-api-key';
const SECRET_KEY = process.env.STEADFAST_SECRET_KEY || 'your-secret-key';

export async function POST(request: Request) {
  try {
    // Parse JSON body from client request
    const order = await request.json();

    // Basic validation (you can expand this)
    if (
      !order.invoice ||
      !order.recipient_name ||
      !order.recipient_phone ||
      !order.recipient_address ||
      typeof order.cod_amount === 'undefined'
    ) {
      return NextResponse.json(
        { error: 'Missing required order fields' },
        { status: 400 }
      );
    }

    // Call Steadfast API
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Api-Key': API_KEY,
        'Secret-Key': SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create order' },
        { status: response.status }
      );
    }

    // Return the response from Steadfast API to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('Steadfast API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
