import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, created, unauthorized, badRequest, notFound, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
        children: {
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { products: true } } },
        },
      },
    });

    return ok({
      categories: categories.map((c) => ({
        ...c,
        productsCount: c._count.products,
        children: c.children.map((ch) => ({
          ...ch,
          productsCount: ch._count.products,
        })),
      })),
    });
  } catch (e) {
    return serverError(String(e));
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { name, slug, image, sort_order, is_active, parent_id } = await req.json();
    if (!name) return badRequest("Name is required");

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        image: image || null,
        sortOrder: sort_order || 0,
        isActive: is_active !== false,
        parentId: parent_id ? parseInt(parent_id) : null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "categories",
        action: "created",
        detail: `Created category: ${category.name}`,
      },
    });

    return created({ category, message: "Category created" });
  } catch (e) {
    return serverError(String(e));
  }
}
