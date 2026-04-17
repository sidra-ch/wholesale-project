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
    const status = url.searchParams.get("status") || "";

    const where: Prisma.PurchaseOrderWhereInput = {};
    if (search) {
      where.OR = [
        { poNumber: { contains: search, mode: "insensitive" } },
        { supplier: { name: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
        include: {
          supplier: { select: { id: true, name: true } },
          items: true,
        },
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return ok({
      data: items.map((po) => ({
        id: po.id,
        poNumber: po.poNumber,
        supplierId: po.supplierId,
        supplierName: po.supplier.name,
        status: po.status,
        subtotal: Number(po.subtotal),
        taxAmount: Number(po.taxAmount),
        shippingCost: Number(po.shippingCost),
        totalAmount: Number(po.totalAmount),
        items: po.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          receivedQuantity: item.receivedQuantity,
          subtotal: Number(item.subtotal),
        })),
        notes: po.notes,
        expectedAt: po.expectedAt,
        receivedAt: po.receivedAt,
        createdAt: po.createdAt,
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

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();
    if (!body.supplier_id || !body.items?.length) {
      return badRequest("Supplier and items required");
    }

    const count = await prisma.purchaseOrder.count();
    const now = new Date();
    const poNumber = `PO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(count + 1).padStart(5, "0")}`;

    const subtotal = body.items.reduce((sum: number, item: { quantity: number; unit_price: number }) =>
      sum + item.quantity * item.unit_price, 0
    );
    const total = subtotal + (body.tax_amount || 0) + (body.shipping_cost || 0);

    const po = await prisma.purchaseOrder.create({
      data: {
        supplierId: body.supplier_id,
        poNumber,
        status: body.status || "draft",
        subtotal,
        taxAmount: body.tax_amount || 0,
        shippingCost: body.shipping_cost || 0,
        totalAmount: total,
        notes: body.notes || null,
        expectedAt: body.expected_at ? new Date(body.expected_at) : null,
        items: {
          create: body.items.map((item: { product_name: string; sku: string; quantity: number; unit_price: number }) => ({
            productName: item.product_name,
            sku: item.sku || null,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            subtotal: item.quantity * item.unit_price,
          })),
        },
      },
      include: { items: true, supplier: { select: { name: true } } },
    });

    return created({ purchase_order: po, message: "Purchase order created" });
  } catch (e) {
    return serverError(String(e));
  }
}
