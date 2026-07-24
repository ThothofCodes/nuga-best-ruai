import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["on-site", "off-site"], required: true },
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
      enum: ["pending", "confirmed", "declined", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
