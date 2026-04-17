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
    const productId = url.searchParams.get("productId") || url.searchParams.get("product_id");
    const type = url.searchParams.get("type");

    const where: Prisma.StockLogWhereInput = {};
    if (productId) where.productId = parseInt(productId);
    if (type) where.type = type as never;

    const [items, total] = await Promise.all([
      prisma.stockLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
        include: {
          product: { select: { name: true, sku: true } },
          creator: { select: { name: true } },
        },
      }),
      prisma.stockLog.count({ where }),
    ]);

    return ok({
      data: items.map((l) => ({
        id: l.id,
        productId: l.productId,
        productName: l.product.name,
        productSku: l.product.sku,
        type: l.type,
        quantity: l.quantity,
        reason: l.reason,
        referenceId: l.referenceId,
        note: l.note,
        createdByName: l.creator?.name || null,
        createdAt: l.createdAt,
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
