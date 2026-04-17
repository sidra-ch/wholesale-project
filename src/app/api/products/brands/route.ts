import { prisma } from "@/lib/db";
import { ok, serverError } from "@/lib/api-response";

export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      where: { isActive: true, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    });
    return ok({ brands: brands.map((b) => b.brand).filter(Boolean) });
  } catch (e) {
    return serverError(String(e));
  }
}
