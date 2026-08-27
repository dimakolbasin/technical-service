import { PageType } from "./analytics/enums";

export const routes = {
  home: { pageType: PageType.Core, component: "home" },
  services: { pageType: PageType.Core, component: "services" },
  prices: { pageType: PageType.Core, component: "prices" },
  contacts: { pageType: PageType.Core, component: "contacts" },
  privacy: { pageType: PageType.Core, component: "privacy" },
  "washing-machines": { pageType: PageType.Service, component: "detail" },
  dishwashers: { pageType: PageType.Service, component: "detail" },
  hobs: { pageType: PageType.Service, component: "detail" },
  ovens: { pageType: PageType.Service, component: "detail" },
  "ac-cleaning": { pageType: PageType.Service, component: "detail" },
  "ac-repair": { pageType: PageType.Service, component: "detail" },
  refrigerators: { pageType: PageType.Service, component: "detail" },
  dryers: { pageType: PageType.Service, component: "detail" },
  "gas-boilers": { pageType: PageType.Service, component: "detail" },
  "washing-machine-not-draining": {
    pageType: PageType.Article,
    component: "detail",
  },
  "dishwasher-not-draining": {
    pageType: PageType.Article,
    component: "detail",
  },
  "oven-not-heating": { pageType: PageType.Article, component: "detail" },
  "hob-not-turning-on": { pageType: PageType.Article, component: "detail" },
  "ac-not-cooling": { pageType: PageType.Article, component: "detail" },
  "ac-cleaning-importance": {
    pageType: PageType.Article,
    component: "detail",
  },
  "refrigerator-not-cooling": {
    pageType: PageType.Article,
    component: "detail",
  },
  "dryer-not-drying": { pageType: PageType.Article, component: "detail" },
  "gas-boiler-not-igniting": {
    pageType: PageType.Article,
    component: "detail",
  },
} as const;

export type RouteKey = keyof typeof routes;
export type RouteComponent = (typeof routes)[RouteKey]["component"];
export type RouteKeyByComponent<Component extends RouteComponent> = {
  [Key in RouteKey]: (typeof routes)[Key]["component"] extends Component
    ? Key
    : never;
}[RouteKey];
export const routeKeys = Object.keys(routes) as RouteKey[];

export function isDetailRoute(
  key: RouteKey,
): key is RouteKeyByComponent<"detail"> {
  return routes[key].component === "detail";
}
