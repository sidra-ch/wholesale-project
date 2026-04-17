import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const orderId = parseInt(id);
    const { status } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) return notFound("Order not found");

    const updateData: Record<string, unknown> = { status };

    // Set timestamps based on status
    if (status === "shipped") updateData.shippedAt = new Date();
    if (status === "delivered") updateData.deliveredAt = new Date();
    if (status === "cancelled") {
      updateData.cancelledAt = new Date();
      // Restore stock for cancelled orders
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
        await prisma.stockLog.create({
          data: {
            productId: item.productId,
            type: "in",
            quantity: item.quantity,
            reason: "return_stock",
            referenceId: order.id,
            createdBy: admin.id,
          },
        });
      }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData as never,
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "orders",
        action: "status_updated",
        detail: `Order ${order.orderNumber} status changed to ${status}`,
      },
    });

    return ok({ order: updated, message: "Order updated" });
  } catch (e) {
    return serverError(String(e));
  }
}
