const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:edwinspire@gmail.com',
  process.env.VAPIDKEY_PUBLIC,
  process.env.VAPIDKEY_PRIVATE
);

module.exports = webpush;