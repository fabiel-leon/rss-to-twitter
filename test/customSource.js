require('dotenv').config();
const { rewriter } = require('rss-rewriter');
const rssToTwitter = require('../src');

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
  cron: '1/15 * * * * *',
  // filter: async () => true,
  source: async () => rewriter({
    source: 'https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss', // source url or stream
    site: 'https://pricecrypto.surge.sh/redirect', // redirection page
    title: 'My Rss title',
    description: 'My Rss description',
    format: 'rss', // rss|atom|json  , default is rss
    array: true, // return array of items instead of string result in defined format
  }),
});
