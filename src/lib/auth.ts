import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Extract and verify the authenticated user from a request.
 * Returns the user record or null.
 */
export async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}

/**
 * Require admin role. Returns user or throws.
 */
export async function requireAdmin(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") return null;
  return user;
}

/**
 * Get permissions for an admin user.
 */
export async function getUserPermissions(userId: number) {
  const adminRoles = await prisma.adminUserRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  const roles = adminRoles.map((ar) => ar.role.name);
  const permissionSet = new Set<string>();
  for (const ar of adminRoles) {
    for (const rp of ar.role.permissions) {
      permissionSet.add(rp.permission.slug);
    }
  }

  return { roles, permissions: Array.from(permissionSet) };
}
