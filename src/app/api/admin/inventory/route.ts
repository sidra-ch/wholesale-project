import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError, getPagination } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const url = new URL(req.url);
    const { perPage, skip, page } = getPagination(url);
    const search = url.searchParams.get("search") || "";
    const stockStatus = url.searchParams.get("stockStatus") || url.searchParams.get("stock_status") || "";

    let where = `WHERE 1=1`;
    const params: unknown[] = [];
    let paramIdx = 1;

    if (search) {
      where += ` AND (p.name ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (stockStatus === "low_stock") {
      where += ` AND p.stock <= p.low_stock_threshold AND p.stock > 0`;
    } else if (stockStatus === "out_of_stock") {
      where += ` AND p.stock = 0`;
    } else if (stockStatus === "in_stock") {
      where += ` AND p.stock > p.low_stock_threshold`;
    }

    const countResult = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
      `SELECT COUNT(*)::int as count FROM products p ${where}`,
      ...params
    );
    const total = countResult[0]?.count || 0;

    const items = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `SELECT p.id, p.name, p.sku, p.brand, p.stock, p.low_stock_threshold, p.unit,
              c.name as category_name,
              CASE WHEN p.stock = 0 THEN 'out_of_stock'
                   WHEN p.stock <= p.low_stock_threshold THEN 'low_stock'
                   ELSE 'in_stock' END as stock_status,
              (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) as image
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.stock ASC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      ...params,
      perPage,
      skip
    );

    return ok({
      data: items.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        brand: item.brand,
        stock: item.stock,
        lowStockThreshold: item.low_stock_threshold,
        unit: item.unit,
        category: item.category_name ? { name: item.category_name } : null,
        stockStatus: item.stock_status,
        image: item.image,
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
