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

    const customers = await prisma.$queryRawUnsafe<Array<{
      customer_id: number;
      customer_name: string;
      email: string;
      total_orders: number;
      total_spent: number;
    }>>(
      `SELECT u.id as customer_id, u.name as customer_name, u.email,
              COUNT(o.id)::int as total_orders,
              COALESCE(SUM(o.total_amount), 0)::float as total_spent
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
         AND o.created_at >= $1::date AND o.created_at <= ($2::date + interval '1 day')
         AND o.payment_status = 'paid'
       WHERE u.role = 'customer'
       GROUP BY u.id, u.name, u.email
       ORDER BY total_spent DESC
       LIMIT $3`,
      from,
      to,
      limit
    );

    return ok({ data: customers.map((c) => ({ id: c.customer_id, name: c.customer_name, email: c.email, totalOrders: c.total_orders, totalSpent: c.total_spent })), from, to });
  } catch (e) {
    return serverError(String(e));
  }
}
