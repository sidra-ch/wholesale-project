import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const [
      totalRevenue,
      lastMonthRevenue,
      thisMonthRevenue,
      todayRevenue,
      totalOrders,
      lastMonthOrders,
      thisMonthOrders,
      thisWeekOrders,
      todayOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      approvedCustomers,
      lastMonthCustomers,
      totalProducts,
      pendingCustomers,
      recentOrders,
      topProducts,
      monthlyRevenue,
      recentCustomers,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "paid" } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "paid", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "paid", createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "paid", createdAt: { gte: startOfToday } } }),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfThisWeek } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "processing" } }),
      prisma.order.count({ where: { status: "shipped" } }),
      prisma.order.count({ where: { status: "delivered" } }),
      prisma.order.count({ where: { status: "cancelled" } }),
      prisma.user.count({ where: { role: "customer" } }),
      prisma.user.count({ where: { role: "customer", status: "approved" } }),
      prisma.user.count({ where: { role: "customer", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "customer", status: "pending" } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          payments: { select: { paymentMethod: true, status: true } },
        },
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true, subtotal: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.$queryRawUnsafe<Array<{ month: string; revenue: number; orders: number }>>(
        `SELECT to_char(created_at, 'YYYY-MM') as month,
                COALESCE(SUM(total_amount), 0)::float as revenue,
                COUNT(*)::int as orders
         FROM orders
         WHERE payment_status = 'paid'
           AND created_at >= $1
         GROUP BY month
         ORDER BY month ASC`,
        new Date(now.getFullYear() - 1, now.getMonth(), 1)
      ),
      prisma.user.findMany({
        where: { role: "customer" },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, businessName: true, status: true, createdAt: true, _count: { select: { orders: true } } },
      }),
    ]);

    const lowStockCount = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
      `SELECT COUNT(*)::int as count FROM products WHERE is_active = true AND stock <= low_stock_threshold AND stock > 0`
    );
    const outOfStockCount = await prisma.product.count({ where: { isActive: true, stock: 0 } });

    const totalRevenueNum = Number(totalRevenue._sum.totalAmount || 0);
    const lastMonthRevenueNum = Number(lastMonthRevenue._sum.totalAmount || 0);
    const thisMonthRevenueNum = Number(thisMonthRevenue._sum.totalAmount || 0);
    const todayRevenueNum = Number(todayRevenue._sum.totalAmount || 0);
    const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenueNum / totalOrders) * 100) / 100 : 0;

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "+100" : "0";
      return ((current - previous) / previous * 100).toFixed(1);
    };

    return ok({
      stats: {
        totalRevenue: totalRevenueNum,
        lastMonthRevenue: lastMonthRevenueNum,
        thisMonthRevenue: thisMonthRevenueNum,
        todayRevenue: todayRevenueNum,
        revenueChange: calcChange(thisMonthRevenueNum, lastMonthRevenueNum),
        totalOrders,
        lastMonthOrders,
        thisMonthOrders,
        thisWeekOrders,
        todayOrders,
        orderChange: calcChange(thisMonthOrders, lastMonthOrders),
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalProducts,
        totalCustomers,
        approvedCustomers,
        customerChange: calcChange(totalCustomers, lastMonthCustomers),
        pendingCustomers,
        lowStockProducts: lowStockCount[0]?.count || 0,
        outOfStockProducts: outOfStockCount,
        avgOrderValue,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.user.name,
        customerEmail: o.user.email,
        totalAmount: Number(o.totalAmount),
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.payments[0]?.paymentMethod || "N/A",
        createdAt: o.createdAt,
      })),
      topProducts: topProducts.map((tp) => ({
        productId: tp.productId,
        productName: tp.productName,
        totalQuantity: tp._sum.quantity,
        totalRevenue: Number(tp._sum.subtotal),
      })),
      monthlyRevenue,
      recentCustomers: recentCustomers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        businessName: c.businessName,
        status: c.status,
        orderCount: c._count.orders,
        createdAt: c.createdAt,
      })),
    });
  } catch (e) {
    return serverError(String(e));
  }
}
