import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const settings = await prisma.setting.findMany();
    const obj: Record<string, string> = {};
    for (const s of settings) {
      obj[s.key] = s.value;
    }

    return ok({ settings: obj });
  } catch (e) {
    return serverError(String(e));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        module: "settings",
        action: "updated",
        detail: `Updated settings: ${Object.keys(body).join(", ")}`,
      },
    });

    return ok({ message: "Settings updated" });
  } catch (e) {
    return serverError(String(e));
  }
}
