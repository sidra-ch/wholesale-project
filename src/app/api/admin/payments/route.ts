import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError, getPagination } from "@/lib/api-response";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const url = new URL(req.url);
    const { perPage, skip, page } = getPagination(url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const paymentMethod = url.searchParams.get("paymentMethod") || url.searchParams.get("payment_method") || "";

    const where: Prisma.PaymentWhereInput = {};
    if (search) {
      where.OR = [
        { transactionId: { contains: search, mode: "insensitive" } },
        { order: { orderNumber: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (status) where.status = status as never;
    if (paymentMethod) where.paymentMethod = paymentMethod as never;

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
              user: { select: { name: true, email: true } },
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return ok({
      data: items.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        orderNumber: p.order.orderNumber,
        customerName: p.order.user.name,
        amount: Number(p.amount),
        paymentMethod: p.paymentMethod,
        status: p.status,
        transactionId: p.transactionId,
        paidAt: p.paidAt,
        notes: p.notes,
        createdAt: p.createdAt,
      })),
      total,
      currentPage: page,
      perPage: perPage,
      lastPage: Math.ceil(total / perPage),
    });
  } catch (e) {
    return serverError(String(e));
  }
}
