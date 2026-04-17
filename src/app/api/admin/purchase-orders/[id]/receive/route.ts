import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, notFound, badRequest, serverError } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const { items } = await req.json();

    if (!items?.length) return badRequest("Items with received quantities required");

    const po = await prisma.purchaseOrder.findUnique({
      where: { id: parseInt(id) },
      include: { items: true },
    });
    if (!po) return notFound("Purchase order not found");

    // Update received quantities
    for (const item of items) {
      await prisma.purchaseOrderItem.update({
        where: { id: item.id },
        data: { receivedQuantity: item.received_quantity },
      });
    }

    // Mark as received
    await prisma.purchaseOrder.update({
      where: { id: parseInt(id) },
      data: { status: "received", receivedAt: new Date() },
    });

    return ok({ message: "Purchase order received" });
  } catch (e) {
    return serverError(String(e));
  }
}
