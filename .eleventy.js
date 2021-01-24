const eleventyVue = require('@11ty/eleventy-plugin-vue');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/fonts');

  eleventyConfig.addWatchTarget('./src/css/');
  eleventyConfig.addPlugin(eleventyVue);

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};