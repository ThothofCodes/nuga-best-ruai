import { NextResponse } from "next/server";
import crypto from "crypto";
import { SESSION_CONFIG } from "@/lib/bookingConfig";

function safeCompare(a, b) {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) {
      crypto.timingSafeEqual(bufA, bufA); // constant-time to avoid length leak
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function getToken(password) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  return crypto.createHmac("sha256", secret).update(password).digest("hex");
}

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured on the server." },
        { status: 500 }
      );
    }

    if (!password || !safeCompare(password, adminPassword)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const token = getToken(password);
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_CONFIG.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_CONFIG.maxAge,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Admin login failed:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_CONFIG.cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
