module.exports = {
  layout: "layouts/base.ejs",
  pagination: {
    data: "i18n.languages",
    size: 1,
    alias: "lang",
  },
  pageKey: "home",
  eleventyComputed: {
    permalink: (data) => `${data.lang.paths.home}index.html`,
    title: (data) => data.lang.home.metaTitle,
    description: (data) => data.lang.home.metaDescription,
  },
};
