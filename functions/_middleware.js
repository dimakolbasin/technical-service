export async function onRequest(context) {
    function isSearchBot(request) {
        const ua = (request.headers.get("User-Agent") || "").toLowerCase();
        const yandexTokens = [
            "yandexbot",
            "yandexmobilebot",
            "yandeximages",
            "yandexvideo",
            "yandexnews",
            "yandexblogs",
            "yandexmedia",
            "yandexdirect",
            "yandexcatalog",
            "yandexmarket",
            "yandexaccessibilitybot",
            "yandexfavicons"
        ];
        const isYandexBot = yandexTokens.some((token) => ua.includes(token)) ||
            (ua.includes("yandex") && (ua.includes("bot") || ua.includes("spider")));

        // Major bots (add more if needed)
        return (
            ua.includes("googlebot") ||
            isYandexBot ||
            ua.includes("bingbot") ||
            ua.includes("duckduckbot") ||
            ua.includes("baiduspider") ||
            ua.includes("slurp") ||          // Yahoo
            ua.includes("facebookexternalhit") ||
            ua.includes("twitterbot")
        );
    }

    const { request, next } = context;
    const url = new URL(request.url);

    // 1) Normalize language root without trailing slash (e.g., /ru -> /ru/).
    const langMatch = url.pathname.match(/^\/(ru|en|ka)$/);
    if (langMatch) {
        // For normalization, no need to set cookies.
        return redirect(`/${langMatch[1]}/`, null, 301, url.protocol === "https:");
    }

    // 2) Only handle the site root; let other paths pass through.
    if (url.pathname !== "/") {
        return next();
    }

    // 3) Bots: NEVER redirect from "/" (Yandex likes 200 here).
    // Serve the real "/" page (should contain links to /ru/, /en/, /ka/).
    if (isSearchBot(request)) {
        return next();
    }

    // 4) Humans: cookie preference.
    const cookie = request.headers.get("Cookie") || "";
    const cookieMatch = cookie.match(/preferred_lang=(ru|en|ka)/);
    if (cookieMatch) {
        return redirect(`/${cookieMatch[1]}/`, cookieMatch[1], 302, url.protocol === "https:");
    }

    // 5) Humans: Accept-Language header.
    const accept = (request.headers.get("Accept-Language") || "").toLowerCase();
    const chosen = pickLangFromAcceptLanguage(accept);
    return redirect(`/${chosen}/`, chosen, 302, url.protocol === "https:");
}

function pickLangFromAcceptLanguage(accept) {
    // Prefer exact matches / language tags
    // Note: Georgian is commonly "ka"; Russian "ru"; English "en"
    if (accept.includes("ka")) return "ka";
    if (accept.includes("en")) return "en";
    return "ru";
}

function redirect(path, lang, status = 302, isHttps = true) {
    const headers = new Headers({
        Location: path,
        // Cache:
        // - 301 can be cached
        // - 302 should NOT be cached publicly (varies per user)
        "Cache-Control": status === 301 ? "public, max-age=3600" : "private, no-cache",
        // Vary is correct because decision depends on these
        Vary: "Accept-Language, Cookie, User-Agent",
    });

    // Only set cookie for 302 language selection (humans)
    if (status === 302 && lang) {
        let cookie = `preferred_lang=${lang}; Path=/; Max-Age=2592000; SameSite=Lax`;
        if (isHttps) cookie += "; Secure";
        headers.append("Set-Cookie", cookie);
    }

    return new Response(null, { status, headers });
}
