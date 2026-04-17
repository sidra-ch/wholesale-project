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
    const body = await req.json();

    const coupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.code !== undefined && { code: body.code.toUpperCase() }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.value !== undefined && { value: body.value }),
        ...(body.min_order_value !== undefined && { minOrderValue: body.min_order_value }),
        ...(body.max_uses !== undefined && { maxUses: body.max_uses }),
        ...(body.is_active !== undefined && { isActive: body.is_active }),
        ...(body.expires_at !== undefined && { expiresAt: body.expires_at ? new Date(body.expires_at) : null }),
      },
    });

    return ok({ coupon, message: "Coupon updated" });
  } catch (e) {
    return serverError(String(e));
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    await prisma.coupon.delete({ where: { id: parseInt(id) } });
    return ok({ message: "Coupon deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
