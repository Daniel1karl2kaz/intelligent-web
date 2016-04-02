/**
 * Created by fabio on 18/02/15.
 */
var protocol = require('http');
var static = require('node-static');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var Twit = require('twit');


var client = new Twit({
  consumer_key: 'p3z3Uya200JQo6itVOOWixkW8',
  consumer_secret: 'wXMbKhs2OVsCi5UUQaJAIHo2fLR2KGy42FbzZ8vCWsPqsXxBIg',
  access_token: '277462049-YNaK9sdOazCkG6XrltVWUgynV1olfnMlqPfKTDQm',
  access_token_secret: 'hQyUBW1MGd2fryHinjqQNrQZjybsoSw5zevwLxIaicHgo'
});

 var file = new (static.Server)();
  var portNo = 3001;
  var app = protocol.createServer(function (req, res) {
      var pathname = url.parse(req.url).pathname;
      if ((req.method == 'POST') && (pathname == '/postFile.html')) {
          var body = '';
          req.on('data', function (data) {
              body += data;
              // if body >  1e6 === 1 * Math.pow(10, 6) ~~~ 1MB
              // flood attack or faulty client
              // (code 413: req entity too large), kill req
              if (body.length > 1e6) {
                  res.writeHead(413,
                      {'Content-Type': 'text/plain'}).end();
                  req.connection.destroy();
              }
          });
          req.on('end', function () {
              var string = JSON.parse(body);
              res.writeHead(200, {"Content-Type": "application/json"});
             //res.write(body);

              jsonx = {};


              client.get('search/tweets', { q:string.teamname, count:13},
              function searchTweets(err, data, response) {
                for(var index in data.statuses){
                  var tweet = data.statuses[index];


                  jsonx[index] = tweet;


                }
                console.log(jsonx);
                res.end(JSON.stringify(jsonx));
              });

        });
   }


      else {
          file.serve(req, res, function (err, result) {
              if (err != null) {
                  console.error('Error serving %s - %s', req.url, err.message);
                  if (err.status === 404 || err.status === 500) {
                      file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
                  } else {
                      res.writeHead(err.status, err.headers);
                      res.end();
                  }
              } else {
                  res.writeHead(200, {"Content-Type": "text/plain", 'Access-Control-Allow-Origin': '*'});

              }
          });
      }
  }).listen(portNo);
