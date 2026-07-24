import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  const start = Date.now();

  try {
    await connectDB();

    const mongoState =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    const latencyMs = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mongo: { state: mongoState, latencyMs },
      version: process.env.npm_package_version || "0.1.0",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
