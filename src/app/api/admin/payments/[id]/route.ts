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
    const { status, transaction_id, notes } = await req.json();

    const payment = await prisma.payment.findUnique({ where: { id: parseInt(id) } });
    if (!payment) return notFound("Payment not found");

    const updated = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status: status as never }),
        ...(transaction_id && { transactionId: transaction_id }),
        ...(notes !== undefined && { notes }),
        ...(status === "paid" && { paidAt: new Date() }),
      },
    });

    // Update order payment status if payment is marked paid
    if (status === "paid") {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "paid" },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "payments",
        action: "updated",
        detail: `Payment #${id} status changed to ${status}`,
      },
    });

    return ok({ payment: updated, message: "Payment updated" });
  } catch (e) {
    return serverError(String(e));
  }
}
