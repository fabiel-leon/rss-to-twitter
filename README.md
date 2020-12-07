# rss-to-twitter

This is the module that you need to send rss news to a twitter account.

support for:

- Cron sintaxis to flexible time publishing.
- Filter function, to filter your content.
- Preprocess function to add extra data to meessages.
- Flexible message template with handlebar.

## using this module

https://twitter.com/aserebit

## Install

```sh
npm i rss-to-twitter
```

## use

get your twitter api keys https://developer.twitter.com/en/portal/dashboard

```javascript
const rssToTwitter = require("rss-to-twitter");
const {
  TWITTER_CONSUMER_KEY: consumerKey,
  TWITTER_CONSUMER_SECRET: consumerSecret,
  TWITTER_ACCESS_TOKEN: accessToken,
  TWITTER_ACCESS_TOKEN_SECRET: accessTokenSecret,
} = process.env;

rssToTwitter({
  consumerKey,
  consumerSecret,
  accessToken,
  accessTokenSecret,
  cron: "0 0 6 * * *", // publish every day at 6:00 AM , cron sintaxis
  timezone: "America/Havana", // your defined timezone
  // rss source
  // can be an async function or and array of objects
  source: "https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss",
  // source: async () => {
  //   return db.get({ limit: 10 }); // your custom source of items,(db)
  // },
  // source: [{colo:"red"}],
  // add new fields to show in the message
  // define you own message template
  template: "Color is {{color}},{{title}}\n{{link}}",
  preprocess: async (item) => {
    item.color = "green";
    item.short = await bitly.short(item.link);
    return item;
  },
  // filter news of the day, use this function to filter already published posts
  filter: async ({ date }) => {
    const d = new Date();
    return (
      date.getDate() === d.getDate() &&
      date.getMonth() === d.getMonth() &&
      date.getFullYear() === d.getFullYear()
    );
  },
  // add extra common fields to all items,
  extraFields: { colo: "red", line: "stroke" }, // add line field to all items and overwrite color field
});
```

## Cron sintaxis

```text
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
```

- every five minutes. `0 */5 * * * *`
- every quarter hour. `0 */15 * * * *`
- every hour at minute 30. `0 30 * * * *`
- three times every hour, at minute 0, 5 and 10 `0 0,5,10 * * * *`
- every half hour `0 */30 * * * *`

More example https://crontab.guru/examples.html

## Timezone

https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json

## Template fields

- title
- link
- image
- channel
- description
- date

use the preprocess function to add fields, then modify the template to show the new fields in the message

```js
rssToTwitter({
...
 preprocess: async (item) => {
    item.color = "green";
    return item;
 },
 template: 'Color is {{color}}, Link is {{link}}, Title is {{title}} \n @{{channel}}',
...
})
```

Donate Bitcoin:

bitcoin:3GqQcxFk5y7onUyoTKqZHwoWXvLusqJSVG

`3GqQcxFk5y7onUyoTKqZHwoWXvLusqJSVG`

Contact: `fabiel.leon.oliva@gmail.com`
