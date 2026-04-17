import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const productId = parseInt(id);
    const body = await req.json();

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return notFound("Product not found");

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.sku !== undefined && { sku: body.sku }),
        ...(body.category_id !== undefined && { categoryId: parseInt(body.category_id) }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.short_description !== undefined && { shortDescription: body.short_description }),
        ...(body.retail_price !== undefined && { retailPrice: body.retail_price }),
        ...(body.wholesale_price !== undefined && { wholesalePrice: body.wholesale_price }),
        ...(body.distributor_price !== undefined && { distributorPrice: body.distributor_price }),
        ...(body.cost_price !== undefined && { costPrice: body.cost_price }),
        ...(body.moq !== undefined && { moq: body.moq }),
        ...(body.stock !== undefined && { stock: body.stock }),
        ...(body.low_stock_threshold !== undefined && { lowStockThreshold: body.low_stock_threshold }),
        ...(body.brand !== undefined && { brand: body.brand }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.weight !== undefined && { weight: body.weight }),
        ...(body.is_active !== undefined && { isActive: body.is_active }),
        ...(body.is_featured !== undefined && { isFeatured: body.is_featured }),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "products",
        action: "updated",
        detail: `Updated product: ${product.name}`,
      },
    });

    return ok({ product, message: "Product updated" });
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
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });
    if (!product) return notFound("Product not found");

    // Delete Cloudinary assets
    for (const img of product.images) {
      if (img.publicId) {
        try {
          await deleteFromCloudinary(img.publicId, img.type === "video" ? "video" : "image");
        } catch { /* ignore cleanup errors */ }
      }
    }

    await prisma.product.delete({ where: { id: productId } });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "products",
        action: "deleted",
        detail: `Deleted product: ${product.name}`,
      },
    });

    return ok({ message: "Product deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
