import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.name) data.name = body.name;
    if (body.email) data.email = body.email;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.role) data.role = body.role;
    if (body.status) data.status = body.status;
    if (body.password) data.password = await hashPassword(body.password);

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    return ok(user);
  } catch (e) {
    return serverError(String(e));
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    return ok({ message: "User deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
