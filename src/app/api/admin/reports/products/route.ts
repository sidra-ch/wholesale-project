import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const url = new URL(req.url);
    const from = url.searchParams.get("from") || new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    const to = url.searchParams.get("to") || new Date().toISOString().split("T")[0];
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const products = await prisma.$queryRawUnsafe<Array<{
      product_id: number;
      product_name: string;
      sku: string;
      total_quantity: number;
      total_revenue: number;
      order_count: number;
    }>>(
      `SELECT oi.product_id, oi.product_name, oi.sku,
              SUM(oi.quantity)::int as total_quantity,
              SUM(oi.subtotal)::float as total_revenue,
              COUNT(DISTINCT oi.order_id)::int as order_count
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE o.created_at >= $1::date AND o.created_at <= ($2::date + interval '1 day')
         AND o.payment_status = 'paid'
       GROUP BY oi.product_id, oi.product_name, oi.sku
       ORDER BY total_revenue DESC
       LIMIT $3`,
      from,
      to,
      limit
    );

    return ok({ data: products.map((p) => ({ id: p.product_id, name: p.product_name, sku: p.sku, totalSold: p.total_quantity, totalRevenue: p.total_revenue, orderCount: p.order_count })), from, to });
  } catch (e) {
    return serverError(String(e));
  }
}
