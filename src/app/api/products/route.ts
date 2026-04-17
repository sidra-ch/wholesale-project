import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, serverError, getPagination } from "@/lib/api-response";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const { perPage, skip } = getPagination(url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const brand = url.searchParams.get("brand") || "";
    const featured = url.searchParams.get("featured");
    const sort = url.searchParams.get("sort") || "created_at";
    const order = url.searchParams.get("order") || "desc";

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }
    if (brand) {
      where.brand = { equals: brand, mode: "insensitive" };
    }
    if (featured === "true") {
      where.isFeatured = true;
    }

    const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
      created_at: { createdAt: order === "asc" ? "asc" : "desc" },
      createdAt: { createdAt: order === "asc" ? "asc" : "desc" },
      name: { name: order === "asc" ? "asc" : "desc" },
      price: { wholesalePrice: order === "asc" ? "asc" : "desc" },
    };
    const orderBy = orderByMap[sort] || orderByMap.createdAt;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return ok({
      data: items,
      total,
      page: Math.floor(skip / perPage) + 1,
      perPage,
      lastPage: Math.ceil(total / perPage),
    });
  } catch (e) {
    return serverError(String(e));
  }
}
