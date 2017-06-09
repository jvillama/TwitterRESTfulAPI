var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 5000,
  bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/tweetRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, function() {
  console.log('CORS-enabled Twitter RESTful API server started on: ' + port);
});
