import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: parseInt(id) },
      include: {
        supplier: true,
        items: true,
      },
    });
    if (!po) return notFound("Purchase order not found");

    return ok({ purchase_order: po });
  } catch (e) {
    return serverError(String(e));
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.purchaseOrder.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.expected_at !== undefined && { expectedAt: body.expected_at ? new Date(body.expected_at) : null }),
      },
    });

    return ok({ purchase_order: updated, message: "Purchase order updated" });
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
    await prisma.purchaseOrder.delete({ where: { id: parseInt(id) } });
    return ok({ message: "Purchase order deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
