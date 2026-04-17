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

    const where: Prisma.SupplierWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.supplier.count({ where }),
    ]);

    return ok({
      data: items.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company,
        address: s.address,
        city: s.city,
        country: s.country,
        paymentTerms: s.paymentTerms,
        status: s.status,
        createdAt: s.createdAt,
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
    if (!body.name) return badRequest("Supplier name required");

    const supplier = await prisma.supplier.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        company: body.company || null,
        address: body.address || null,
        city: body.city || null,
        country: body.country || null,
        paymentTerms: body.payment_terms || null,
        status: body.status || "active",
      },
    });

    return created({ supplier, message: "Supplier created" });
  } catch (e) {
    return serverError(String(e));
  }
}
