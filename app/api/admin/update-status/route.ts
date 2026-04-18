import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const ADMIN_EMAIL = "christoph_adam@outlook.de";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { addonId, status } = body as {
      addonId?: string;
      status?: "approved" | "rejected";
    };

    if (!addonId || !status) {
      return NextResponse.json(
        { error: "Missing addonId or status" },
        { status: 400 }
      );
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("addons")
      .update({ status })
      .eq("id", addonId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      addonId,
      status,
    });
  } catch (error) {
    console.error("ADMIN UPDATE STATUS ERROR:", error);

    return NextResponse.json(
      { error: "Server error while updating addon status." },
      { status: 500 }
    );
  }
}