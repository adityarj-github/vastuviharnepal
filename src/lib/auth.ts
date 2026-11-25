import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vastu-vihar-nepal-super-secret-jwt-key-2026-auth"
);

export const AUTH_COOKIE_NAME = "vastu_admin_token";

export type UserRole = "ROOT" | "MEDIA" | "HR" | "SALES";

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole | string;
}

export function isRoot(role: string): boolean {
  return role === "ROOT";
}

export function canAccessLeads(role: string): boolean {
  return role === "ROOT" || role === "SALES";
}

export function canAccessHR(role: string): boolean {
  return role === "ROOT" || role === "HR";
}

export function canAccessMedia(role: string): boolean {
  return role === "ROOT" || role === "MEDIA";
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function signAuthToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently logged-in user from request cookies or server headers.
 */
export async function getAuthenticatedUser(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyAuthToken(token);
    if (!payload?.id) return null;

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}
