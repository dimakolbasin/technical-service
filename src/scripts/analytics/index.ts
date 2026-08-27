import type { Gtag, PageContext } from "../../lib/analytics/types";
import { createAnalyticsTracker } from "./tracker";

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

const body = document.body;

if (
  body.dataset.gaTracking !== "disabled" &&
  typeof window.gtag === "function"
) {
  // Page context is emitted by the typed build-time layout.
  const analytics = createAnalyticsTracker(window.gtag, {
    page_key: body.dataset.pageKey,
    page_type: body.dataset.pageType,
    page_language: body.dataset.pageLanguage,
  } as PageContext);

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;

      const contact = event.target.closest<HTMLElement>(
        "[data-ga-contact-method]",
      );
      if (contact) return analytics.contact(contact.dataset);

      const content = event.target.closest<HTMLElement>(
        "[data-ga-content-type]",
      );
      if (content) return analytics.content(content.dataset);

      const language = event.target.closest<HTMLElement>(
        "[data-ga-language-switch]",
      );
      if (language) analytics.language(language.dataset);
    },
    true,
  );

  document
    .querySelectorAll<HTMLDetailsElement>("details[data-ga-faq-scope]")
    .forEach((faq) => {
      faq.addEventListener("toggle", () => {
        if (faq.open) analytics.faq(faq.dataset);
      });
    });
}

export {};
