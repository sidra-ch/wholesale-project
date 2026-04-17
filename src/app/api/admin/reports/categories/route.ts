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

    const categories = await prisma.$queryRawUnsafe<Array<{
      category_id: number;
      category_name: string;
      total_revenue: number;
      total_orders: number;
      total_quantity: number;
    }>>(
      `SELECT p.category_id, c.name as category_name,
              SUM(oi.subtotal)::float as total_revenue,
              COUNT(DISTINCT oi.order_id)::int as total_orders,
              SUM(oi.quantity)::int as total_quantity
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       JOIN categories c ON c.id = p.category_id
       JOIN orders o ON o.id = oi.order_id
       WHERE o.created_at >= $1::date AND o.created_at <= ($2::date + interval '1 day')
         AND o.payment_status = 'paid'
       GROUP BY p.category_id, c.name
       ORDER BY total_revenue DESC`,
      from,
      to
    );

    return ok({ data: categories.map((c) => ({ id: c.category_id, name: c.category_name, totalRevenue: c.total_revenue, totalOrders: c.total_orders, totalSold: c.total_quantity })), from, to });
  } catch (e) {
    return serverError(String(e));
  }
}
