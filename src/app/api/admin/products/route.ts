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
    const categoryId = url.searchParams.get("category_id");

    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
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
      currentPage: page,
      perPage,
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
    const {
      name, slug, sku, category_id, description, short_description,
      retail_price, wholesale_price, distributor_price, cost_price,
      moq, stock, low_stock_threshold, brand, unit, weight,
      is_active, is_featured, images,
    } = body;

    if (!name || !sku || !category_id) {
      return badRequest("Name, SKU, and category are required");
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku,
        categoryId: parseInt(category_id),
        description: description || null,
        shortDescription: short_description || null,
        retailPrice: retail_price || 0,
        wholesalePrice: wholesale_price || 0,
        distributorPrice: distributor_price || 0,
        costPrice: cost_price || 0,
        moq: moq || 1,
        stock: stock || 0,
        lowStockThreshold: low_stock_threshold || 10,
        brand: brand || null,
        unit: unit || "piece",
        weight: weight || null,
        isActive: is_active !== false,
        isFeatured: is_featured === true,
      },
      include: {
        images: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    // Create images if provided
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: images[i].imageUrl || images[i].image_url || images[i],
            altText: images[i].altText || images[i].alt_text || product.name,
            type: images[i].type || "image",
            sortOrder: i,
          },
        });
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "products",
        action: "created",
        detail: `Created product: ${product.name}`,
      },
    });

    return created({ product, message: "Product created" });
  } catch (e) {
    return serverError(String(e));
  }
}
