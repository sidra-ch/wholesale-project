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
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
      include: { purchaseOrders: { orderBy: { createdAt: "desc" }, take: 10 } },
    });
    if (!supplier) return notFound("Supplier not found");

    return ok({ supplier });
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

    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.company !== undefined && { company: body.company }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.payment_terms !== undefined && { paymentTerms: body.payment_terms }),
        ...(body.status !== undefined && { status: body.status }),
      },
    });

    return ok({ supplier, message: "Supplier updated" });
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
    await prisma.supplier.delete({ where: { id: parseInt(id) } });
    return ok({ message: "Supplier deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
