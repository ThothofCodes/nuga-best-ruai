import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { validateBookingPayload, BOOKING_STATUSES, LIMITS } from "@/lib/bookingConfig";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, name, phone, date, time, notes, location } = body;

    const { valid, errorMsg } = validateBookingPayload(body);
    if (!valid) {
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.create({
      type,
      name: name.trim(),
      phone: phone.trim(),
      date,
      time,
      notes: notes || "",
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

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).limit(LIMITS.maxBookingsPerRequest);
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Fetching bookings failed:", err);
    return NextResponse.json({ error: "Could not load bookings." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status." }, { status: 400 });
    }

    if (!BOOKING_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("Updating booking failed:", err);
    return NextResponse.json({ error: "Could not update booking." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing booking id." }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Deleting booking failed:", err);
    return NextResponse.json({ error: "Could not delete booking." }, { status: 500 });
  }
}
