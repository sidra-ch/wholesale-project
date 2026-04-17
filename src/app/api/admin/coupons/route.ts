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

    const where: Prisma.CouponWhereInput = {};
    if (search) {
      where.code = { contains: search, mode: "insensitive" };
    }

    const [items, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.coupon.count({ where }),
    ]);

    return ok({
      data: items.map((c) => ({
        id: c.id,
        code: c.code,
        type: c.type,
        value: Number(c.value),
        minOrderValue: c.minOrderValue ? Number(c.minOrderValue) : null,
        maxUses: c.maxUses,
        usedCount: c.usedCount,
        isActive: c.isActive,
        expiresAt: c.expiresAt,
        createdAt: c.createdAt,
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

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();
    if (!body.code) return badRequest("Coupon code required");

    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        type: body.type || "percentage",
        value: body.value || 0,
        minOrderValue: body.min_order_value || null,
        maxUses: body.max_uses || null,
        isActive: body.is_active !== false,
        expiresAt: body.expires_at ? new Date(body.expires_at) : null,
      },
    });

    return created({ coupon, message: "Coupon created" });
  } catch (e) {
    return serverError(String(e));
  }
}
