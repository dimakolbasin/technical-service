module.exports = {
  layout: "layouts/base.ejs",
  pagination: {
    data: "i18n.languages",
    size: 1,
    alias: "lang",
  },
  eleventyComputed: {
    pageKey: (data) => data.page.fileSlug,
    permalink: (data) => `${data.lang.paths[data.page.fileSlug]}index.html`,
    title: (data) => data.lang.pages[data.page.fileSlug].title,
    description: (data) =>
      data.lang.pages[data.page.fileSlug].description || data.lang.pages[data.page.fileSlug].lead,
    robots: (data) => (data.page.fileSlug === "privacy" ? "noindex, follow" : "index, follow"),
  },
};
