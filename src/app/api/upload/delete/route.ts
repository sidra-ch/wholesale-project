import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, badRequest, serverError } from "@/lib/api-response";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { public_id, type } = await req.json();
    if (!public_id) return badRequest("public_id required");

    await deleteFromCloudinary(public_id, type === "video" ? "video" : "image");
    return ok({ message: "Deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
