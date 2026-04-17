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
    const parentId = url.searchParams.get("parentId") || url.searchParams.get("parent_id");

    const where: Prisma.CategoryWhereInput = { parentId: { not: null } };
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (parentId) {
      where.parentId = parseInt(parentId);
    }

    const [items, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip,
        take: perPage,
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { products: true } },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return ok({
      data: items.map((c) => ({
        ...c,
        parentId: c.parentId,
        sortOrder: c.sortOrder,
        isActive: c.isActive,
        parentName: c.parent?.name || null,
        productsCount: c._count.products,
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

    const { name, slug, parent_id, image, sort_order, is_active } = await req.json();
    if (!name || !parent_id) return badRequest("Name and parent category required");

    const subcategory = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        parentId: parseInt(parent_id),
        image: image || null,
        sortOrder: sort_order || 0,
        isActive: is_active !== false,
      },
    });

    return created({ subcategory, message: "Subcategory created" });
  } catch (e) {
    return serverError(String(e));
  }
}
