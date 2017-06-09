'use strict';

module.exports = function(app) {
  var tweetList = require('../controllers/tweetController');

  app.route('/analyze_text')
    .post(tweetList.analyze_text);

  app.route('/tweets/:query')
    .get(tweetList.search_tweets);
};
