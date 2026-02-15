const buildUrls = (site, languages) => {
  const urls = new Set();

  const pageKeys = [
    "services",
    "prices",
    "contacts",
    "about",
    "washing-machines",
    "dishwashers",
    "hobs",
    "ovens",
    "ac-cleaning",
    "washing-machine-not-draining",
    "dishwasher-not-draining",
    "oven-not-heating",
    "hob-not-turning-on",
    "ac-not-cooling",
    "ac-cleaning-importance",
  ];

  languages.forEach((lang) => {
    urls.add(site.baseUrl + lang.paths.home);
    pageKeys.forEach((key) => {
      if (lang.paths[key]) urls.add(site.baseUrl + lang.paths[key]);
    });
  });

  return Array.from(urls);
};

exports.data = {
  permalink: "sitemap.xml",
  eleventyExcludeFromCollections: true,
};

exports.render = function (data) {
  const urls = buildUrls(data.site, data.i18n.languages);
  const now = new Date().toISOString();

  const body = urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
};
