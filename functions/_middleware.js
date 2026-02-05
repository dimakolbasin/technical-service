export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only handle the site root; let other paths pass through.
  if (url.pathname !== "/") {
    return next();
  }

  const supported = ["ru", "en", "ka"];

  // 1) Cookie preference.
  const cookie = request.headers.get("Cookie") || "";
  const cookieMatch = cookie.match(/preferred_lang=(ru|en|ka)/);
  if (cookieMatch) {
    return redirect(`/${cookieMatch[1]}/`);
  }

  // 2) Accept-Language header.
  const accept = request.headers.get("Accept-Language") || "";
  for (const lang of supported) {
    if (accept.toLowerCase().includes(lang)) {
      return redirect(`/${lang}/`, lang);
    }
  }

  // 3) Fallback to Russian.
  return redirect("/ru/", "ru");
}

function redirect(path, lang) {
  const headers = new Headers({
    Location: path,
    "Cache-Control": "no-store",
  });

  if (lang) {
    headers.append(
      "Set-Cookie",
      `preferred_lang=${lang}; Path=/; Max-Age=2592000; SameSite=Lax`
    );
  }

  return new Response(null, {
    status: 302,
    headers,
  });
}
