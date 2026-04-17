import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { ok, created, unauthorized, badRequest, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const users = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return ok(users);
  } catch (e) {
    return serverError(String(e));
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();
    if (!body.email || !body.password || !body.name) return badRequest("Name, email, and password required");

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return badRequest("Email already exists");

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await hashPassword(body.password),
        phone: body.phone || null,
        role: body.role || "admin",
        status: "approved",
      },
    });

    return created({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    return serverError(String(e));
  }
}
