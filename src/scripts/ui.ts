const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const COOKIE_NOTICE_STORAGE_KEY = "cookie_notice_closed";
const PREFERRED_LANG_COOKIE = "preferred_lang";

const cookieNotice = document.querySelector<HTMLElement>(
  "[data-cookie-notice]",
);

function hideCookieNotice(): void {
  cookieNotice?.classList.add("cookie-notice--hidden");
}

try {
  if (window.sessionStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === "true")
    hideCookieNotice();
} catch {}

cookieNotice?.addEventListener("click", (event) => {
  if ((event.target as Element).closest("a")) return;
  try {
    window.sessionStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, "true");
  } catch {}
  hideCookieNotice();
});

document
  .querySelectorAll<HTMLElement>("[data-ga-language-switch]")
  .forEach((link) => {
    link.addEventListener("click", () => {
      const code = link.dataset.lang;
      if (!code) return;
      document.cookie = `${PREFERRED_LANG_COOKIE}=${encodeURIComponent(code)};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};samesite=lax`;
    });
  });
