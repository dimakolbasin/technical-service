import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  AnalyticsEventName,
  ContactMethod,
  ContentType,
  FaqScope,
  LocaleCode,
  PageType,
  TrackingLocation,
} from "../../src/lib/analytics";

type CapturedEvent = {
  command: string;
  event: string;
  payload: Record<string, unknown>;
};

async function capturedPayload(
  page: Page,
  eventName: AnalyticsEventName,
): Promise<Record<string, unknown> | undefined> {
  return page.evaluate(
    (name) =>
      (
        window as unknown as {
          __gaEvents: CapturedEvent[];
        }
      ).__gaEvents.findLast((entry) => entry.event === name)?.payload,
    eventName,
  );
}

const archetypes = [
  ["home", "/"],
  ["service", "/services/washing-machines/"],
  ["ac-repair", "/services/ac-repair/"],
  ["article", "/articles/washing-machine-not-draining/"],
  ["services", "/services/"],
  ["prices", "/prices/"],
  ["contacts", "/contacts/"],
  ["privacy", "/privacy/"],
] as const;

for (const [name, path] of archetypes) {
  test(`${name} visual and accessibility parity`, async ({ page }) => {
    await page.route(/^https:\/\//, (route) => route.abort());
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${name}.png`, {
      animations: "disabled",
      fullPage: true,
    });
    if (!process.env.UPDATE_SNAPSHOTS) {
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
  });
}

test("interactive behavior and analytics markers work", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const testWindow = window as unknown as {
      __gaEvents: CapturedEvent[];
      gtag: (
        command: string,
        event: string,
        payload: Record<string, unknown>,
      ) => void;
    };
    testWindow.__gaEvents = [];
    testWindow.gtag = (command, event, payload) =>
      testWindow.__gaEvents.push({ command, event, payload });
  });
  await page.goto("/");

  const contact = page
    .locator(`[data-ga-contact-method='${ContactMethod.Call}']`)
    .first();
  await expect(contact).toHaveAttribute("data-ga-location", /.+/);
  await contact.dispatchEvent("click");
  const contactEvent = await capturedPayload(
    page,
    AnalyticsEventName.ContactClick,
  );
  expect(contactEvent).toMatchObject({
    contact_method: ContactMethod.Call,
    cta_location: TrackingLocation.HeaderPhone,
    page_key: "home",
    page_type: PageType.Core,
    page_language: LocaleCode.Ru,
    transport_type: "beacon",
  });

  const content = page
    .locator(`[data-ga-content-type='${ContentType.ServiceCard}']`)
    .first();
  await content.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    (element as HTMLElement).click();
  });
  const contentEvent = await capturedPayload(
    page,
    AnalyticsEventName.SelectContent,
  );
  expect(contentEvent).toMatchObject({
    content_type: ContentType.ServiceCard,
    cta_location: TrackingLocation.HomeServices,
    page_key: "home",
    page_type: PageType.Core,
    page_language: LocaleCode.Ru,
    transport_type: "beacon",
  });
  expect(contentEvent?.destination_key).toEqual(expect.any(String));

  const notice = page.locator("[data-cookie-notice]");
  await notice.click();
  await expect(notice).toHaveClass(/cookie-notice--hidden/);

  const faq = page.locator("details[data-ga-faq-scope]").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await expect
    .poll(() => capturedPayload(page, AnalyticsEventName.FaqOpen))
    .toEqual({
      page_key: "home",
      page_language: LocaleCode.Ru,
      faq_scope: FaqScope.Home,
      faq_index: 1,
      transport_type: "beacon",
    });

  const languageSwitch = page
    .locator(
      `[data-ga-language-switch='${TrackingLocation.Header}'][data-lang='en']`,
    )
    .first();
  await languageSwitch.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    (element as HTMLElement).click();
  });
  expect(
    await capturedPayload(page, AnalyticsEventName.LanguageSwitch),
  ).toEqual({
    from_language: LocaleCode.Ru,
    to_language: LocaleCode.En,
    cta_location: TrackingLocation.Header,
    page_key: "home",
    transport_type: "beacon",
  });

  await languageSwitch.click();
  await expect(page).toHaveURL(/\/en\/$/);
  const cookies = await context.cookies();
  expect(
    cookies.find((cookie) => cookie.name === "preferred_lang")?.value,
  ).toBe("en");
});
