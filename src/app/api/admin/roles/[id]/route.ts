import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { id } = await params;
    const { name, permissions } = await req.json();

    // Delete old permissions then recreate
    await prisma.rolePermission.deleteMany({ where: { roleId: parseInt(id) } });

    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        name,
        permissions: permissions?.length
          ? { create: permissions.map((pid: number) => ({ permissionId: pid })) }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
    return ok(role);
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
    await prisma.rolePermission.deleteMany({ where: { roleId: parseInt(id) } });
    await prisma.role.delete({ where: { id: parseInt(id) } });
    return ok({ message: "Role deleted" });
  } catch (e) {
    return serverError(String(e));
  }
}
