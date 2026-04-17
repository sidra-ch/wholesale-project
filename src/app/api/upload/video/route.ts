import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, badRequest, serverError } from "@/lib/api-response";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return badRequest("No file uploaded");

    if (!file.type.startsWith("video/")) return badRequest("Only video files allowed");

    const folder = (formData.get("folder") as string) || "wholesale/videos";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, {
      folder,
      resourceType: "video",
    });

    return ok({
      url: result.url,
      public_id: result.publicId,
      type: "video" as const,
    });
  } catch (e) {
    return serverError(String(e));
  }
}
