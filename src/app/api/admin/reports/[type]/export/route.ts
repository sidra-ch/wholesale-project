import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-response";
import { NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { type } = await params;
    const url = new URL(req.url);
    const from = url.searchParams.get("from") || new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    const to = url.searchParams.get("to") || new Date().toISOString().split("T")[0];

    let rows: Array<Record<string, unknown>> = [];

    if (type === "sales") {
      rows = await prisma.$queryRawUnsafe(
        `SELECT to_char(created_at, 'YYYY-MM-DD') as date,
                order_number, total_amount::float, status, payment_status
         FROM orders
         WHERE created_at >= $1::date AND created_at <= ($2::date + interval '1 day')
         ORDER BY created_at DESC`,
        from, to
      );
    } else if (type === "products") {
      rows = await prisma.$queryRawUnsafe(
        `SELECT oi.product_name, oi.sku, SUM(oi.quantity)::int as total_qty,
                SUM(oi.subtotal)::float as total_revenue
         FROM order_items oi JOIN orders o ON o.id = oi.order_id
         WHERE o.created_at >= $1::date AND o.created_at <= ($2::date + interval '1 day')
         GROUP BY oi.product_name, oi.sku ORDER BY total_revenue DESC`,
        from, to
      );
    }

    // Convert to CSV
    if (!rows.length) {
      return new NextResponse("No data", { status: 200, headers: { "Content-Type": "text/plain" } });
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "")}"`).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-report.csv"`,
      },
    });
  } catch (e) {
    return serverError(String(e));
  }
}
