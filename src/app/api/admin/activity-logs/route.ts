import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError, getPagination } from "@/lib/api-response";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const url = new URL(req.url);
    const { perPage, skip, page } = getPagination(url);
    const search = url.searchParams.get("search") || "";
    const module = url.searchParams.get("module") || "";

    const where: Prisma.ActivityLogWhereInput = {};
    if (search) {
      where.OR = [
        { action: { contains: search, mode: "insensitive" } },
        { detail: { contains: search, mode: "insensitive" } },
      ];
    }
    if (module) where.module = module;

    const [items, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return ok({
      data: items.map((l) => ({
        id: l.id,
        userName: l.user?.name || "System",
        userEmail: l.user?.email || null,
        module: l.module,
        action: l.action,
        detail: l.detail,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt,
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
