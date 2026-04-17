import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, created, unauthorized, badRequest, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const roles = await prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: "asc" },
    });
    return ok(roles);
  } catch (e) {
    return serverError(String(e));
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { name, permissions } = await req.json();
    if (!name) return badRequest("Role name required");

    const role = await prisma.role.create({
      data: {
        name,
        permissions: permissions?.length
          ? { create: permissions.map((pid: number) => ({ permissionId: pid })) }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
    return created(role);
  } catch (e) {
    return serverError(String(e));
  }
}
