import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, created, unauthorized, badRequest, serverError, getPagination } from "@/lib/api-response";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const url = new URL(req.url);
    const { perPage, skip, page } = getPagination(url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";

    const where: Prisma.OrderWhereInput = {};
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (status && status !== "all") {
      where.status = status as never;
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          orderItems: true,
          payments: { select: { paymentMethod: true, status: true, transactionId: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return ok({
      data: items.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.user,
        items: o.orderItems.map((oi) => ({
          id: oi.id,
          productName: oi.productName,
          sku: oi.sku,
          price: Number(oi.priceAtTime),
          quantity: oi.quantity,
          subtotal: Number(oi.subtotal),
        })),
        subtotal: Number(o.subtotal),
        shippingAmount: Number(o.shippingAmount),
        taxAmount: Number(o.taxAmount),
        discountAmount: Number(o.discountAmount),
        totalAmount: Number(o.totalAmount),
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.payments[0]?.paymentMethod || "N/A",
        shippingAddress: o.shippingAddress,
        notes: o.notes,
        createdAt: o.createdAt,
      })),
      total,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(total / perPage),
    });
  } catch (e) {
    return serverError(String(e));
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();
    if (!body.user_id || !body.items?.length) {
      return badRequest("User and items are required");
    }

    const now = new Date();
    const count = await prisma.order.count();
    const orderNumber = `WS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(count + 1).padStart(5, "0")}`;

    const order = await prisma.order.create({
      data: {
        userId: body.user_id,
        orderNumber,
        subtotal: body.subtotal || 0,
        shippingAmount: body.shipping_amount || 0,
        taxAmount: body.tax_amount || 0,
        discountAmount: body.discount_amount || 0,
        totalAmount: body.total_amount || 0,
        shippingAddress: body.shipping_address || {},
        notes: body.notes || null,
        orderItems: {
          create: body.items.map((item: { product_id: number; product_name: string; sku: string; price: number; quantity: number }) => ({
            productId: item.product_id,
            productName: item.product_name,
            sku: item.sku,
            priceAtTime: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    });

    // Deduct stock
    for (const item of body.items) {
      await prisma.product.update({
        where: { id: item.product_id },
        data: { stock: { decrement: item.quantity } },
      });
      await prisma.stockLog.create({
        data: {
          productId: item.product_id,
          type: "out",
          quantity: item.quantity,
          reason: "order",
          referenceId: order.id,
        },
      });
    }

    return created({ order, message: "Order created" });
  } catch (e) {
    return serverError(String(e));
  }
}
