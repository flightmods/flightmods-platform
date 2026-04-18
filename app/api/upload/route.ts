import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const FILE_BUCKET = "addons";
const IMAGE_BUCKET = "addon-images";

function sanitizeFileName(fileName: string) {
  return fileName.replace(/\s+/g, "_").replace(/[^\w.\-]/g, "");
}

function extractUsernameFromEmail(email?: string | null) {
  return email?.split("@")[0]?.trim() || "User";
}

export async function POST(req: NextRequest) {
  try {
    console.log("UPLOAD API START");

    const formData = await req.formData();
    console.log("UPLOAD FORMDATA READY");

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const sim = String(formData.get("sim") || "MSFS 2020").trim();
    const category = String(formData.get("category") || "Aircraft").trim();
    const version = String(formData.get("version") || "1.0").trim();

    const userId = String(formData.get("userId") || "").trim();
    const userEmail = String(formData.get("userEmail") || "").trim();

    const addonFile = formData.get("file");
    const imageFile = formData.get("image");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Please enter an addon title." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Please enter a description." },
        { status: 400 }
      );
    }

    if (!(addonFile instanceof File)) {
      return NextResponse.json(
        { error: "Please select an addon file." },
        { status: 400 }
      );
    }

    console.log("UPLOAD FILE INFO:", {
      name: addonFile.name,
      size: addonFile.size,
      type: addonFile.type,
    });

    let profileUsername: string | null = null;

    try {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("PROFILE ERROR:", profileError);
      } else {
        profileUsername = profile?.username ?? null;
      }
    } catch (error) {
      console.error("PROFILE LOOKUP FAILED:", error);
    }

    const creatorUsername =
      profileUsername || extractUsernameFromEmail(userEmail);

    const safeFileName = `${Date.now()}_${sanitizeFileName(addonFile.name)}`;
    const fileBuffer = Buffer.from(await addonFile.arrayBuffer());

    console.log("START FILE STORAGE UPLOAD:", safeFileName);

    const { error: fileUploadError } = await supabaseAdmin.storage
      .from(FILE_BUCKET)
      .upload(safeFileName, fileBuffer, {
        contentType: addonFile.type || "application/octet-stream",
        upsert: false,
      });

    if (fileUploadError) {
      console.error("FILE UPLOAD ERROR:", fileUploadError);
      return NextResponse.json(
        { error: `Addon file upload failed: ${fileUploadError.message}` },
        { status: 500 }
      );
    }

    console.log("FILE STORAGE UPLOAD DONE");

    const {
      data: { publicUrl: fileUrl },
    } = supabaseAdmin.storage.from(FILE_BUCKET).getPublicUrl(safeFileName);

    let imageUrl: string | null = null;

    if (imageFile instanceof File && imageFile.size > 0) {
      const safeImageName = `${Date.now()}_${sanitizeFileName(imageFile.name)}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

      console.log("START IMAGE STORAGE UPLOAD:", safeImageName);

      const { error: imageUploadError } = await supabaseAdmin.storage
        .from(IMAGE_BUCKET)
        .upload(safeImageName, imageBuffer, {
          contentType: imageFile.type || "application/octet-stream",
          upsert: false,
        });

      if (imageUploadError) {
        console.error("IMAGE UPLOAD ERROR:", imageUploadError);
        return NextResponse.json(
          { error: `Image upload failed: ${imageUploadError.message}` },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl: publicImageUrl },
      } = supabaseAdmin.storage.from(IMAGE_BUCKET).getPublicUrl(safeImageName);

      imageUrl = publicImageUrl;
      console.log("IMAGE STORAGE UPLOAD DONE");
    }

    const payload = {
      title,
      description,
      sim,
      category,
      version: version || "1.0",
      file_url: fileUrl,
      image_url: imageUrl,
      author: creatorUsername,
      author_id: userId,
      author_name: creatorUsername,
      downloads: 0,
      status: "pending",
    };

    console.log("INSERT ADDON ROW");

    const { error: insertError } = await supabaseAdmin
      .from("addons")
      .insert([payload]);

    if (insertError) {
      console.error("DB INSERT ERROR:", insertError);
      return NextResponse.json(
        { error: `Database insert failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    console.log("UPLOAD API SUCCESS");

    return NextResponse.json({
      success: true,
      message: "Addon uploaded successfully and is now pending review.",
    });
  } catch (error) {
    console.error("UPLOAD API UNEXPECTED ERROR:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred during upload." },
      { status: 500 }
    );
  }
}