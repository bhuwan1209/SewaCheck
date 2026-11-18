import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOCALES = ["en", "ne"];

/**
 * 1) Sends visitors without a language in the URL to /en or /ne.
 *    (Nepali browsers go to /ne, everyone else to /en.)
 * 2) Keeps the moderator's login session fresh on the moderation page.
 * (In Next.js 16 "middleware" is called "proxy".)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (!LOCALES.includes(first)) {
    const accept = request.headers.get("accept-language") ?? "";
    const locale = /^\s*ne\b/i.test(accept) ? "ne" : "en";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  if (
    pathname.includes("/moderation") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (toSet) => {
            toSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );
    await supabase.auth.getUser();
    return response;
  }
  return NextResponse.next();
}

// Skip Next.js internals and files with an extension (images, favicon, ...)
export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
