require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["ejs", "md", "html", "11ty.js"],
    htmlTemplateEngine: "ejs",
    markdownTemplateEngine: "ejs",
    dataTemplateEngine: "ejs"
  };
};
