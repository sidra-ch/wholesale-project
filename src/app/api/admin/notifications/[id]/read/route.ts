import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    return ok({ message: "Marked as read" });
  } catch (e) {
    return serverError(String(e));
  }
}
