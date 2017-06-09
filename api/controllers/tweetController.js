'use strict';

var twit = require('twit');
var unirest = require('unirest');
var config = require('../../config');

var client = new twit({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
})

/*
  Get a new API key at https://market.mashape.com/vivekn/sentiment-3 or
  https://market.mashape.com/twinword/sentiment-analysis
*/
var sentiment = {}
sentiment.init = function () {
  //var sentiment_url = 'https://community-sentiment.p.mashape.com/text/';
  var sentiment_url = 'https://twinword-sentiment-analysis.p.mashape.com/analyze/';
  return unirest.post(sentiment_url)
    .headers({'X-Mashape-Key': config.sentiment,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'});
}

exports.analyze_text = function(req, res) {
  var text = req.body.text;
  var httpCall = sentiment.init();

  if (typeof text !== 'undefined') {
    httpCall.send('text=' + text).end(function (result) {
      if (typeof result.body !== 'undefined') {
        res.send(result.body);
        /*
        //var sentim = result.body.result.sentiment
        var sentim = result.body.type
        //var confidence = parseFloat(result.body.result.confidence)
        var confidence = parseFloat(result.body.score)
        console.log(confidence, sentim)
        
        // if sentiment is Negative and the confidence is above 75%
        //if (sentim === 'Negative' && confidence >= 75) {
        if (sentim === 'negative' && confidence <= -0.75) {
          console.log('RETWEET NEG NEG NEG', sentim, retweetText)
          return
        }
        */
      } else {
        console.warn('Sentiment API is down')
        console.log(result.body)
      }
    });
  } else {
    console.warn({'error': 'Please enter valid text'});
    res.json({'error': 'Please enter valid text'});
  }
};

exports.search_tweets = function(req, res) {
  var params = {q: req.params.query, lang: 'en'};
  if (typeof params.q !== 'undefined') {
    client.get('search/tweets', params, function(error, tweets, response) {
      if (error) {
        console.warn('Something went wrong while SEARCHING...')
        res.send(error);
      } else {
        res.json(tweets);
      }
    });
  } else {
    console.warn({'error': 'Please enter valid search query'});
    res.json({'error': 'Please enter valid search query'});
  }
};