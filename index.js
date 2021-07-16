const RSS = require('rss-generator');
const fs = require('fs-extra');
const path = require('path');

let sortArticles = function (prop, arr) {
  prop = prop.split('.');
  var len = prop.length;

  arr.sort(function (a, b) {
      var i = 0;
      while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
      if (a < b) {
          return -1;
      } else if (a > b) {
          return 1;
      } else {
          return 0;
      }
  });
  return arr;
};

const defaultRSSDate = new Date(Date.now());

const plugin = {
  name: 'rss-generator',
  description: `Generate RSS Feed of articles`,
  minimumElderjsVersion: "1.4.13", // you can leave blank. 
  init: (plugin) => {
    // this is a sync function that runs on plugin initialization.
    // if you need async, it is recommended that you extract the async logic to run on the 'bootstrap' hook.

    // Plugins have their own closure scope. This means that if you set:
    // plugin.init = true
    // you will have access to plugin.init in all of your hooks.
    // this data can be updated in hooks and will be persistent between page loads.
    
    // IMPORTANT: It is important to note that since builds are run across child processes, 
    // the 'plugin' object is not consistent across all processes.

    // Plugins also get the build settings (plugin.settings) and the config (plugin.config) settings. 
 
    return plugin;
  },
  hooks: [
    {
      hook: 'allRequests',
      name: 'allRequestsToRSS',
      description: `Generates an RSS Feed for blogs.`,
      priority: 2,
      run: async ({ allRequests, data, settings, plugin, routes}) => {

        // all props and mutations are detailed here: https://github.com/Elderjs/elderjs/blob/master/src/hooks/hookInterface.ts
        // if you are looking for details on what a prop or mutation represents you can read this: https://github.com/Elderjs/elderjs/blob/master/src/hooks/hookEntityDefinitions.ts

        // here is how you'd read the init property set in the init() function
        plugin.bootstrapRan = true;

        console.log(`Beginning RSS generation.`);
        console.time('RSS');

        let feed = new RSS({
          title: plugin.config.feedTitle,
          description: plugin.config.feedDescription,
          feed_url: settings.origin + plugin.config.feedUrl,
          site_url: settings.origin,
          image_url: settings.origin + plugin.config.feedImageUrl,
          copyright: plugin.config.feedCopyright,
          language: plugin.config.feedLanguage,
          categories: plugin.config.feedCategories,
          pubDate: plugin.config.feedPubDate,
          ttl: plugin.config.feedTTL,
        });

        for (let article of data.markdown[plugin.config.markdownRoute]) {

          feed.item({
            title:  article.frontmatter.title,
            description: article.frontmatter.description,
            url: settings.origin + "/" + article.slug + "/", // link to the item
            categories: article.frontmatter.keywords, // optional - array of item categories
            author: article.frontmatter.author, // optional - defaults to feed author property
            date: article.frontmatter.published, // any format that js Date can parse.
          });
        };

        let xml = feed.xml();

        fs.writeFileSync(path.resolve(settings.distDir, `./rss-articles.xml`), xml, {
          encoding: 'utf-8',
        });

        console.log(`Writing RSS feed`);
        console.timeEnd('RSS');

        return {
          plugin,
        };
      }
    },
  ],
  config: { // here is where you set the default configs for your plugin. These are merged with the configs found in the user's elder.config.js file.
    feedTitle: '',
    feedDescription: '',
    feedUrl: '/rss-articles.xml',
    feedSiteUrl: '',
    feedImgUrl: '',
    feedCopyright: '',
    feedLanguage: '',
    feedCategories: [],
    feedPubDate: defaultRSSDate,
    feedTTL: '60',
    markdownRoute: ['blog'],
  }
};

module.exports = plugin;
