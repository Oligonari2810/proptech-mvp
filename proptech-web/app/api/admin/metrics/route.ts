import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-mvp-1.onrender.com";
    const res = await fetch(`${backend}/api/admin/metrics`, {
      cache: "no-store",
      headers: {
        // Ensure JSON response from backend
        Accept: "application/json",
      },
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "forward_error";
    // Keep shape flexible; caller already has fallback UI/data
    return NextResponse.json({ status: "error", message }, { status: 200 });
  }
}

