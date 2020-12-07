const { stream, feedparser } = require('rss-rewriter');
const { CronJob } = require('cron');
const handlebars = require('handlebars');
const async = require('async');
const fetch = require('node-fetch');
const Twit = require('twit');

module.exports = ({
  consumerKey,
  consumerSecret,
  accessToken,
  accessTokenSecret,
  source,
  cron = '00 00 06 * * *',
  timezone = 'America/Havana',
  template = '{{title}}\n{{link}}',
  filter,
  preprocess,
  extraFields = {},
}) => {
  const twitter = new Twit({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  });

  const publishTwit = (text, mediaId) => new Promise((resolve, reject) => {
    const params = {
      status: text,
    };

    if (mediaId) {
      params.media_ids = [mediaId];
    }

    twitter.post('statuses/update', params, (err, data) => {
      if (err || data.error) {
        reject(err || new Error(data.error));
      } else {
        // console.log(data);
        resolve(data);
      }
    });
  });

  const publishTwitWithImage = (item, compiled) => {
    const text = compiled(item);
    if (item.image) {
      return new Promise((resolve, reject) => {
        // descargar imagen
        // console.log(`descargando imagen ${item.image}`);
        fetch(item.image)
          .then((res) => res.buffer())
          .then((buffer) => {
            // console.log('publicando imagen descargada');
            twitter.post('media/upload', {
              media_data: buffer.toString('base64'),
            }, (err, data) => {
              // console.log('imagen publicada', data);
              // now we can assign alt text to the media, for use by screen readers and
              // other text-based presentations and interpreters
              if (err || data.error) {
                reject(err || new Error(data.error));
              } else {
                const mediaIdStr = data.media_id_string;
                publishTwit(text, mediaIdStr)
                  .then(resolve)
                  .catch(reject);
              }
            });
          });
      });
    }
    // console.log('publicando twit sin imagen');
    return publishTwit(text);
  };


  return new CronJob(
    cron,
    async () => {
      try {
        console.log('executing cron');
        let items;
        if (typeof source === 'function') {
          items = await source();
        } else if (Array.isArray(source)) {
          items = source;
        } else {
          const data = await stream(source);
          items = await feedparser(data);
        }

        const filtered = filter ? await async.filter(items, filter) : items;
        const procesed = preprocess ? await async.map(filtered, preprocess) : filtered;

        console.log('items', items.length, procesed.length);

        const compiled = handlebars.compile(template);
        const result = await async.eachOfSeries(procesed, async (item) => {
          try {
            await publishTwitWithImage({ ...item, ...extraFields }, compiled);
          } catch (error) {
            console.error(error);
          }
        });
        // console.log('finished', result);
      } catch (error) {
        console.error(error);
      }
    },
    null,
    true,
    timezone,
  );
};
