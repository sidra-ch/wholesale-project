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
    const groupBy = url.searchParams.get("groupBy") || url.searchParams.get("group_by") || "day";

    const format = groupBy === "month" ? "YYYY-MM" : groupBy === "week" ? "IYYY-IW" : "YYYY-MM-DD";

    const sales = await prisma.$queryRawUnsafe<Array<{ period: string; revenue: number; orders: number }>>(
      `SELECT to_char(created_at, '${format}') as period,
              COALESCE(SUM(total_amount), 0)::float as revenue,
              COUNT(*)::int as orders
       FROM orders
       WHERE created_at >= $1::date AND created_at <= ($2::date + interval '1 day')
         AND payment_status = 'paid'
       GROUP BY period
       ORDER BY period ASC`,
      from,
      to
    );

    const totals = await prisma.$queryRawUnsafe<Array<{ revenue: number; orders: number; avg_order: number }>>(
      `SELECT COALESCE(SUM(total_amount), 0)::float as revenue,
              COUNT(*)::int as orders,
              COALESCE(AVG(total_amount), 0)::float as avg_order
       FROM orders
       WHERE created_at >= $1::date AND created_at <= ($2::date + interval '1 day')
         AND payment_status = 'paid'`,
      from,
      to
    );

    return ok({
      data: sales.map((s) => ({ date: s.period, totalRevenue: Number(s.revenue), totalOrders: Number(s.orders) })),
      totals: totals[0] || { revenue: 0, orders: 0, avgOrder: 0 },
      from,
      to,
      groupBy,
    });
  } catch (e) {
    return serverError(String(e));
  }
}
