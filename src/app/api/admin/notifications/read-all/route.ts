import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return ok({ message: "All notifications marked as read" });
  } catch (e) {
    return serverError(String(e));
  }
}
