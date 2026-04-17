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

    const existing = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return notFound("Subcategory not found");

    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.parent_id !== undefined && { parentId: parseInt(body.parent_id) }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.sort_order !== undefined && { sortOrder: body.sort_order }),
        ...(body.is_active !== undefined && { isActive: body.is_active }),
      },
    });

    return ok({ subcategory: updated, message: "Subcategory updated" });
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
    await prisma.category.delete({ where: { id: parseInt(id) } });
    return ok({ message: "Subcategory deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
