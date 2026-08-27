import { z } from "zod";
import { routes, type RouteKey } from "../routes";

const optionalText = z.string().min(1).optional();
const textList = z.array(z.string().min(1));
const routeKeySchema = z.enum(Object.keys(routes) as [RouteKey, ...RouteKey[]]);

export const textSectionSchema = z.looseObject({
  title: z.string().min(1),
  lead: optionalText,
  text: optionalText,
  items: textList.optional(),
});

export const listBlockSchema = z.looseObject({
  title: z.string().min(1),
  lead: optionalText,
  items: textList,
});

export const linkItemSchema = z.looseObject({
  key: routeKeySchema,
  title: z.string().min(1),
  text: optionalText,
  label: optionalText,
  linkLabel: optionalText,
});

export const linkBlockSchema = z.looseObject({
  title: z.string().min(1),
  lead: optionalText,
  linkLabel: z.string().min(1),
  items: z.array(linkItemSchema),
});

export const priceValueSchema = z.looseObject({
  currency: optionalText,
  minPrice: z.union([z.number(), z.string().min(1)]),
  maxPrice: z.union([z.number(), z.string().min(1)]).optional(),
  price: z.union([z.number(), z.string().min(1)]).optional(),
});

export const priceItemSchema = z.looseObject({
  label: z.string().min(1),
  value: z.string().min(1),
  schemaPrice: priceValueSchema.optional(),
});

export const priceSectionSchema = z.looseObject({
  title: z.string().min(1),
  lead: optionalText,
  items: z.array(priceItemSchema).optional(),
  groups: z
    .array(
      z.looseObject({
        title: z.string().min(1),
        lead: optionalText,
        items: z.array(priceItemSchema),
      }),
    )
    .optional(),
  note: optionalText,
});

export const faqBlockSchema = z.looseObject({
  title: z.string().min(1),
  lead: optionalText,
  items: z.array(
    z.looseObject({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  ),
});

export const searchPhrasesSchema = z.looseObject({
  title: z.string().min(1),
  groups: z
    .array(
      z.looseObject({
        title: z.string().min(1),
        items: z.array(
          z.looseObject({
            text: z.string().min(1),
            key: routeKeySchema.optional(),
          }),
        ),
      }),
    )
    .optional(),
  items: z
    .array(
      z.looseObject({
        text: z.string().min(1),
        key: routeKeySchema.optional(),
      }),
    )
    .optional(),
});

export const contactItemSchema = z.looseObject({
  type: z.string().min(1),
  label: z.string().min(1),
  value: optionalText,
  href: optionalText,
});

export const contactCardSchema = z.looseObject({
  title: z.string().min(1),
  items: z.array(contactItemSchema),
  note: optionalText,
});

export const ctaBlockSchema = z.looseObject({
  title: z.string().min(1),
  text: z.string().min(1),
  button: z.string().min(1),
});

const basePageFields = {
  title: z.string().min(1),
  heading: z.string().min(1),
  lead: z.string().min(1),
  description: optionalText,
  datePublished: optionalText,
  dateModified: optionalText,
};

export const serviceDetailSchema = z.looseObject({
  ...basePageFields,
  sections: z.array(textSectionSchema).optional(),
  diagnosisSteps: listBlockSchema.optional(),
  brandsHandled: listBlockSchema.optional(),
  trustSignals: listBlockSchema.optional(),
  caseStudies: z
    .looseObject({
      title: z.string().min(1),
      lead: optionalText,
      applianceLabel: z.string().min(1),
      symptomLabel: z.string().min(1),
      diagnosisLabel: z.string().min(1),
      workDoneLabel: z.string().min(1),
      resultLabel: z.string().min(1),
      timeLabel: z.string().min(1),
      priceHintLabel: z.string().min(1),
      fixLabel: optionalText,
      areaLabel: z.string().min(1),
      items: z.array(
        z.looseObject({
          title: z.string().min(1),
          appliance: optionalText,
          symptom: optionalText,
          diagnosis: optionalText,
          workDone: optionalText,
          result: optionalText,
          time: optionalText,
          priceHint: optionalText,
          fix: optionalText,
          area: optionalText,
        }),
      ),
    })
    .optional(),
  photos: z
    .looseObject({
      title: z.string().min(1),
      lead: optionalText,
      items: z.array(
        z.looseObject({
          src: z.string().min(1),
          alt: z.string().min(1),
          caption: optionalText,
          width: z.number().positive().optional(),
          height: z.number().positive().optional(),
        }),
      ),
    })
    .optional(),
  price: priceSectionSchema.optional(),
  faq: faqBlockSchema.optional(),
  related: linkBlockSchema.optional(),
  searchPhrases: searchPhrasesSchema.optional(),
  cta: ctaBlockSchema.optional(),
});

export const servicesPageSchema = z.looseObject({
  ...basePageFields,
  areaNote: optionalText,
  sections: z.array(textSectionSchema).optional(),
  brands: listBlockSchema.optional(),
  guides: linkBlockSchema.optional(),
  searchPhrases: searchPhrasesSchema.optional(),
});

export const pricesPageSchema = z.looseObject({
  ...basePageFields,
  sections: z.array(priceSectionSchema).optional(),
  importantNotes: textList.optional(),
  contactCard: contactCardSchema.optional(),
  searchPhrases: searchPhrasesSchema.optional(),
});

export const contactsPageSchema = z.looseObject({
  ...basePageFields,
  cards: z.array(contactCardSchema),
  businessInfo: z.looseObject({
    title: z.string().min(1),
    nameLabel: z.string().min(1),
    phoneLabel: z.string().min(1),
    emailLabel: z.string().min(1),
    hoursLabel: z.string().min(1),
    addressLabel: z.string().min(1),
    areaLabel: z.string().min(1),
    hours: z.string().min(1),
    area: z.string().min(1),
    note: optionalText,
  }),
  map: z.looseObject({
    title: z.string().min(1),
    lead: z.string().min(1),
    iframeTitle: z.string().min(1),
    googleLabel: z.string().min(1),
    profileLabel: z.string().min(1),
  }),
  trustLabels: z.looseObject({
    years: z.string().min(1),
    repairs: z.string().min(1),
    reviews: z.string().min(1),
    reviewsLink: z.string().min(1),
  }),
  trustSignals: z
    .array(
      z.looseObject({
        label: z.string().min(1),
        value: optionalText,
        text: optionalText,
        href: optionalText,
      }),
    )
    .optional(),
  trustTitle: z.string().min(1),
  quickLinks: z
    .looseObject({
      title: z.string().min(1),
      lead: optionalText,
      items: z.array(
        z.looseObject({
          key: routeKeySchema,
          label: z.string().min(1),
        }),
      ),
    })
    .optional(),
  cta: ctaBlockSchema.optional(),
});

export const privacyPageSchema = z.looseObject({
  ...basePageFields,
  sections: z.array(textSectionSchema),
  linkLabel: z.string().min(1),
});

export const homeSchema = z.looseObject({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  title: z.string().min(1),
  lead: z.string().min(1),
  areaNote: optionalText,
  ctaPrimary: z.string().min(1),
  ctaSecondary: z.string().min(1),
  heroNote: optionalText,
  chips: textList.optional(),
  services: z.looseObject({
    title: z.string().min(1),
    lead: z.string().min(1),
    linkKey: routeKeySchema,
    linkLabel: z.string().min(1),
    ctaToPrices: optionalText,
    items: z.array(
      z.looseObject({
        title: z.string().min(1),
        text: z.string().min(1),
        linkKey: routeKeySchema.optional(),
        serviceIcon: optionalText,
        icon: optionalText,
        highlight: z.boolean().optional(),
      }),
    ),
  }),
  brands: listBlockSchema.optional(),
  benefits: z.looseObject({
    title: z.string().min(1),
    lead: z.string().min(1),
    items: z.array(
      z.looseObject({ title: z.string().min(1), text: z.string().min(1) }),
    ),
  }),
  steps: z.looseObject({
    title: z.string().min(1),
    lead: z.string().min(1),
    items: textList,
  }),
  guides: linkBlockSchema.optional(),
  prices: z.looseObject({
    title: z.string().min(1),
    lead: z.string().min(1),
    items: z.array(priceItemSchema),
  }),
  serviceStandard: z
    .looseObject({
      title: z.string().min(1),
      lead: z.string().min(1),
      content: z
        .looseObject({
          subtitle: z.string().min(1),
          intro: z.string().min(1),
          sections: z
            .array(
              z.looseObject({
                title: z.string().min(1),
                list: textList.optional(),
              }),
            )
            .optional(),
        })
        .optional(),
    })
    .optional(),
  reviews: z
    .looseObject({
      title: z.string().min(1),
      lead: z.string().min(1),
      avatarAlt: z.string().min(1),
      ratingLabel: z.string().min(1),
      leaveReviewLabel: z.string().min(1),
      items: z.array(
        z.looseObject({
          name: z.string().min(1),
          text: z.string().min(1),
          rating: z.number().int().positive().optional(),
          sourceName: optionalText,
        }),
      ),
    })
    .optional(),
  faq: faqBlockSchema.optional(),
  contact: z.looseObject({
    title: z.string().min(1),
    lead: z.string().min(1),
    list: z.array(contactItemSchema),
    form: z.looseObject({
      nameLabel: z.string().min(1),
      namePlaceholder: z.string().min(1),
      phoneLabel: z.string().min(1),
      phonePlaceholder: z.string().min(1),
      phoneRequired: z.string().min(1),
      preferredContactLabel: z.string().min(1),
      descriptionLabel: z.string().min(1),
      descriptionPlaceholder: z.string().min(1),
      submit: z.string().min(1),
      linkKey: routeKeySchema,
      linkLabel: z.string().min(1),
    }),
  }),
});

export const pageSchema = z.union([
  contactsPageSchema,
  privacyPageSchema,
  pricesPageSchema,
  servicesPageSchema,
  serviceDetailSchema,
]);

export const contentSchema = z.union([homeSchema, pageSchema]);
