import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "soil_sisters_admin";

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return adminCookie?.value === "true";
}

export const adminCookieName = ADMIN_COOKIE_NAME;