require('dotenv').config();
const rssToTelegram = require('../src');

const {
  TWITTER_CONSUMER_KEY: consumerKey,
  TWITTER_CONSUMER_SECRET: consumerSecret,
  TWITTER_ACCESS_TOKEN: accessToken,
  TWITTER_ACCESS_TOKEN_SECRET: accessTokenSecret,
} = process.env;

rssToTelegram({
  consumerKey,
  consumerSecret,
  accessToken,
  accessTokenSecret,
  filter: async ({ date }) => {
    const d = new Date();
    return date.getDate() === d.getDate()
      && date.getMonth() === d.getMonth()
      && date.getFullYear() === d.getFullYear();
  },
  cron: '0 * * * * *',
  // extra: {},
  source: 'https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss',
});
