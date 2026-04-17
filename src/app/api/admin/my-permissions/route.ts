import { NextRequest } from "next/server";
import { getUserPermissions, getAuthUser } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorized();

    const permissions = await getUserPermissions(user.id);
    return ok(permissions);
  } catch (e) {
    return serverError(String(e));
  }
}
