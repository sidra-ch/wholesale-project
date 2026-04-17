import { prisma } from "@/lib/db";
import { ok, serverError } from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    const mapped = categories.map((c) => ({
      ...c,
      productsCount: c._count.products,
    }));

    return ok({ categories: mapped });
  } catch (e) {
    return serverError(String(e));
  }
}
