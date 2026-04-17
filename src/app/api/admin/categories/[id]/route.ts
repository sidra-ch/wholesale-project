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
    if (!existing) return notFound("Category not found");

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.sort_order !== undefined && { sortOrder: body.sort_order }),
        ...(body.is_active !== undefined && { isActive: body.is_active }),
        ...(body.parent_id !== undefined && {
          parentId: body.parent_id ? parseInt(body.parent_id) : null,
        }),
      },
    });

    return ok({ category, message: "Category updated" });
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
    const category = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!category) return notFound("Category not found");

    await prisma.category.delete({ where: { id: parseInt(id) } });

    return ok({ message: "Category deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
