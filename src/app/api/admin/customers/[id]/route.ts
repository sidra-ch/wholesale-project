import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const { status, customer_group_id } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return notFound("Customer not found");

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(status !== undefined && { status: status as never }),
        ...(customer_group_id !== undefined && {
          customerGroupId: customer_group_id ? parseInt(customer_group_id) : null,
        }),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "customers",
        action: "updated",
        detail: `Updated customer: ${user.name}`,
      },
    });

    return ok({ customer: updated, message: "Customer updated" });
  } catch (e) {
    return serverError(String(e));
  }
}
