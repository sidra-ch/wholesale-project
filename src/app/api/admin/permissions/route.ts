import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const permissions = await prisma.permission.findMany({ orderBy: { name: "asc" } });
    return ok(permissions);
  } catch (e) {
    return serverError(String(e));
  }
}
