import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, badRequest, notFound, serverError } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { productId } = await params;
    const pid = parseInt(productId);
    const { type, quantity, reason, note } = await req.json();

    if (!type || !quantity || quantity <= 0) {
      return badRequest("Type and positive quantity required");
    }

    const product = await prisma.product.findUnique({ where: { id: pid } });
    if (!product) return notFound("Product not found");

    // Update stock
    if (type === "in") {
      await prisma.product.update({
        where: { id: pid },
        data: { stock: { increment: quantity } },
      });
    } else {
      if (product.stock < quantity) {
        return badRequest("Insufficient stock");
      }
      await prisma.product.update({
        where: { id: pid },
        data: { stock: { decrement: quantity } },
      });
    }

    // Log the stock change
    await prisma.stockLog.create({
      data: {
        productId: pid,
        type: type as never,
        quantity,
        reason: (reason || "manual") as never,
        note: note || null,
        createdBy: admin.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "inventory",
        action: "stock_adjusted",
        detail: `${type === "in" ? "Added" : "Removed"} ${quantity} units of ${product.name}`,
      },
    });

    return ok({ message: "Stock adjusted" });
  } catch (e) {
    return serverError(String(e));
  }
}
