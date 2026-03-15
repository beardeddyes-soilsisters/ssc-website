import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const password = String(formData.get("password") || "");

    if (password !== process.env.ADMIN_PANEL_PASSWORD) {
      return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
    }

    const response = NextResponse.redirect(new URL("/admin", request.url));

    response.cookies.set({
      name: adminCookieName,
      value: "true",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }
}