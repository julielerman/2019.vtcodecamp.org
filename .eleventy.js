

module.exports = function(eleventyConfig) {

    // Copy the `assets/` directory (css, images, etc)
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");

    // add cssmin filter
    const CleanCSS = require("clean-css");
    eleventyConfig.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addFilter("RootURL", function(value) {
        return value.replace('/src','');
    });

    // set markdown defaults (inline so we can extend)
    let markdownIt = require("markdown-it");
    let options = {
      html: true,
      breaks: true,
      linkify: true
    };
    
    // add markdown anchor options
	let markdownItAnchor = require("markdown-it-anchor");
	let opts = {
		permalink: false,
		slugify: function(s) {
            // strip special chars
            let newStr = s.replace(/[^a-z ]/gi,'').trim();
            // take first 4 words and separate with "-""
            newStr = newStr.split(" ").slice(0,4).join("-");
			return newStr;
		},
		permalinkClass: "direct-link",
		permalinkSymbol: "#",
		level: [1,2,3,4]
	};

    eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor, opts));
    
    // add table of contents plugin
    const pluginTOC = require('eleventy-plugin-nesting-toc');
    eleventyConfig.addPlugin(pluginTOC);

    return {
        dir: {
            input: "src",
        },
        passthroughFileCopy: true,

        // By default markdown files are pre-processing with liquid template engine
        // https://www.11ty.io/docs/config/#default-template-engine-for-markdown-files
        markdownTemplateEngine: "njk",
    };
};
