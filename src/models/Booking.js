import mongoose from "mongoose";
import { BOOKING_TYPES, BOOKING_STATUSES, DEFAULT_STATUS } from "@/lib/bookingConfig";

const BookingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: BOOKING_TYPES, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    notes: { type: String, default: "" },
    location: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: DEFAULT_STATUS,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
