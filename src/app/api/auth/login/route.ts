import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";
import { ok, badRequest, unauthorized } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return badRequest("Email and password required");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return unauthorized("Invalid credentials");

    const valid = await comparePassword(password, user.password);
    if (!valid) return unauthorized("Invalid credentials");

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return ok({
      user: {
        id: String(user.id),
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (e) {
    return badRequest(String(e));
  }
}
