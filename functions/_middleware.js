export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  const supported = ["ru", "en", "ka"];

  // Normalize language root without trailing slash (e.g., /ru -> /ru/).
  const langMatch = url.pathname.match(/^\/(ru|en|ka)$/);
  if (langMatch) {
    return redirect(`/${langMatch[1]}/`, langMatch[1], 301, url.protocol === "https:");
  }

  // Only handle the site root; let other paths pass through.
  if (url.pathname !== "/") {
    return next();
  }

  // 1) Cookie preference.
  const cookie = request.headers.get("Cookie") || "";
  const cookieMatch = cookie.match(/preferred_lang=(ru|en|ka)/);
  if (cookieMatch) {
    return redirect(`/${cookieMatch[1]}/`, cookieMatch[1], 302, url.protocol === "https:");
  }

  // 2) Accept-Language header.
  const accept = request.headers.get("Accept-Language") || "";
  for (const lang of supported) {
    if (accept.toLowerCase().includes(lang)) {
      return redirect(`/${lang}/`, lang, 302, url.protocol === "https:");
    }
  }

  // 3) Fallback to Russian.
  return redirect("/ru/", "ru", 302, url.protocol === "https:");
}

function redirect(path, lang, status = 302, isHttps = true) {
  const headers = new Headers({
    Location: path,
    // "Cache-Control": "no-store",
    // "Cache-Control": "no-cache",
    "Cache-Control": "public, max-age=300",
    Vary: "Accept-Language, Cookie",
  });

  if (lang) {
    let cookie = `preferred_lang=${lang}; Path=/; Max-Age=2592000; SameSite=Lax`;
    if (isHttps) {
      cookie += "; Secure";
    }
    headers.append("Set-Cookie", cookie);
  }

  return new Response(null, {
    status,
    headers,
  });
}
