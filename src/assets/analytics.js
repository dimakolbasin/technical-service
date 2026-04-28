(function () {
  var body = document.body;

  if (!body || body.dataset.gaTracking === "disabled") {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  var pageContext = {
    page_key: body.dataset.pageKey || "",
    page_type: body.dataset.pageType || "page",
    page_language: body.dataset.pageLanguage || document.documentElement.lang || "",
  };

  var allowedParams = {
    contact_click: ["contact_method", "cta_location", "page_key", "page_type", "page_language"],
    select_content: ["content_type", "destination_key", "cta_location", "page_key", "page_type", "page_language"],
    language_switch: ["from_language", "to_language", "cta_location", "page_key"],
    faq_open: ["faq_scope", "faq_index", "page_key", "page_language"],
  };

  function sanitizeValue(value) {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value !== "string") {
      return undefined;
    }

    var trimmed = value.trim();
    return trimmed || undefined;
  }

  function buildPayload(eventName, params) {
    var payload = {};
    var keys = allowedParams[eventName] || [];

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var value = sanitizeValue(params[key]);

      if (typeof value !== "undefined") {
        payload[key] = value;
      }
    }

    return payload;
  }

  function trackEvent(eventName, params) {
    if (!allowedParams[eventName]) {
      return;
    }

    var payload = buildPayload(eventName, params || {});
    payload.transport_type = "beacon";

    window.gtag("event", eventName, payload);
  }

  function closestElement(target, selector) {
    if (!(target instanceof Element)) {
      return null;
    }

    return target.closest(selector);
  }

  document.addEventListener(
    "click",
    function (event) {
      var contactLink = closestElement(event.target, "[data-ga-contact-method]");

      if (contactLink) {
        trackEvent("contact_click", {
          contact_method: contactLink.dataset.gaContactMethod,
          cta_location: contactLink.dataset.gaLocation,
          page_key: pageContext.page_key,
          page_type: pageContext.page_type,
          page_language: pageContext.page_language,
        });
        return;
      }

      var contentLink = closestElement(event.target, "[data-ga-content-type]");

      if (contentLink) {
        trackEvent("select_content", {
          content_type: contentLink.dataset.gaContentType,
          destination_key: contentLink.dataset.gaDestinationKey,
          cta_location: contentLink.dataset.gaLocation,
          page_key: pageContext.page_key,
          page_type: pageContext.page_type,
          page_language: pageContext.page_language,
        });
        return;
      }

      var languageLink = closestElement(event.target, "[data-ga-language-switch]");

      if (languageLink) {
        var toLanguage = sanitizeValue(languageLink.dataset.lang);

        if (!toLanguage || toLanguage === pageContext.page_language) {
          return;
        }

        trackEvent("language_switch", {
          from_language: pageContext.page_language,
          to_language: toLanguage,
          cta_location: languageLink.dataset.gaLanguageSwitch,
          page_key: pageContext.page_key,
        });
      }
    },
    true
  );

  var faqItems = document.querySelectorAll("details[data-ga-faq-scope]");

  for (var i = 0; i < faqItems.length; i += 1) {
    faqItems[i].addEventListener("toggle", function () {
      if (!this.open) {
        return;
      }

      trackEvent("faq_open", {
        faq_scope: this.dataset.gaFaqScope,
        faq_index: Number(this.dataset.gaFaqIndex || 0),
        page_key: pageContext.page_key,
        page_language: pageContext.page_language,
      });
    });
  }
})();
