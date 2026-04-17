import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { ok, badRequest } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, businessName, businessType, taxId, address } = body;

    if (!name || !email || !password) {
      return badRequest("Name, email, and password are required");
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return badRequest("Email already registered");

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashed,
        role: "customer",
        status: "pending",
        businessName: businessName || body.business_name || null,
        businessType: businessType || body.business_type || null,
        taxId: taxId || body.tax_id || null,
      },
    });

    // Also create address if provided
    if (address) {
      await prisma.address.create({
        data: {
          userId: user.id,
          label: businessType || "Office",
          name: user.name,
          phone: phone || "",
          address,
          city: "",
          isDefault: true,
        },
      });
    }

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
      message: "Registration successful. Your account is pending approval.",
    }, 201);
  } catch (e) {
    return badRequest(String(e));
  }
}
