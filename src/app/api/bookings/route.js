import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, name, phone, date, time, notes, location } = body;

    if (!type || !name || !phone || !date || !time) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (type === "off-site" && (!location || typeof location.lat !== "number")) {
      return NextResponse.json(
        { error: "A location pin is required for home visits." },
        { status: 400 }
      );
    }

    await connectDB();
    const booking = await Booking.create({
      type,
      name,
      phone,
      date,
      time,
      notes,
      location: type === "off-site" ? location : undefined,
    });

    // TODO: notify the business of the new booking. Africa's Talking SMS or the
    // WhatsApp Business API both work well for this in Kenya — call that here
    // once you have credentials, using booking.phone / business.phone from
    // src/lib/config.js.

    return NextResponse.json({ success: true, id: booking._id }, { status: 201 });
  } catch (err) {
    console.error("Booking creation failed:", err);
    return NextResponse.json({ error: "Could not save booking. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Fetching bookings failed:", err);
    return NextResponse.json({ error: "Could not load bookings." }, { status: 500 });
  }
}
