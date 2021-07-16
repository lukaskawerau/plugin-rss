# Elder.js Plugin: RSS Feed

This plugin generates an RSS feed based on plugin-markdown posts.


## Install

```bash
npm i -s elderjs-plugin-rss
```

## Config

Once installed, open your `elder.config.js` and configure the plugin by adding 'elder-plugin-rss' to your plugin object.

```javascript
plugins: {

  'elderjs-plugin-rss': {
    feedTitle: 'Title Of Your Feed',
    feedDescription: 'Describe your content',
    feedUrl: '/rss-articles.xml', // path for RSS feed
    feedImgUrl: "/img/name_of_logo.png",
    feedCopyright: 'Your Copyright',
    feedLanguage: 'en',
    feedCategories: ['Some','Categories'],
    feedPubDate: new Date(Date.now()),
    feedTTL: '60',
    markdownRoute: ['blog'], // route you set for plugin-markdown
  },

}
```
