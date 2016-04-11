var protocol = require('http');
var static = require('node-static');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var Twit = require('twit');
var mysql = require('mysql');


/**
* Client variable is an object of the twitter api
* Objects in the client include the consumer_key, consumer_secret, access_token, access_token_secret
* @param consumer_key
* @param consumer_secret
* @param access_token
* @param access_token_secret
**/
var client = new Twit({
  consumer_key: 'QQY9a1KOfB9f9yrDu5TPYNxM1',
  consumer_secret: 'KFcrYRVEAou07gQwrjNUmHUsJInLa7kz8TdeCMaxSjC3sD0EEM',
  access_token: '312094689-JpmZ9EJwxUUmZErdzTbagA5zlnndyyXj4ckOVQtE',
  access_token_secret: 'S6U36toKMU9FZNriCh2MqM4ZbYzbnzQ65l8w6m0ydeqEe'
});



var file = new (static.Server)();  //creates  new static server
var portNo = 3001   // port number server is run on
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

        // if the checkbox for team tweets is on run the function for tweets
        if (string.checktweet1 == 'on') {
          tweets(string.teamname)
        }
        // if the checkbox for team mention is on run the function for mentions
        if (string.checkmentions1 == 'on'){
          mentions(string.teamname)
        }
        // if the checkbox for player tweets is on run the function for tweets
        if (string.checktweet2 == 'on'){
          tweets(string.playername)
        }
        // if the checkbox for player mention is on run the function for mentions
        if (string.checkmentions2 == 'on'){
          mentions(string.playername)
        }

      });

// jsonx = {};
// var clientGet = Promise.promisify(client.get, client);
//
// Promise.join(
//   client.get('search/tweets', {q:string.teamname, count:1}),
//   client.get('statuses/user_timeline', {screen_name:string.teamname, count:1}),
//   function(err, data){
//     for(var index in data.statuses){
//       var tweet = data.statuses[index];
//       console.log(tweet.text);
//       jsonx[index] = tweet
//   }
//   res.end(JSON.stringify(jsonx))
// }
// )
jsonx = {};
/**
* Query the twitter api and retrieve tweets from twitter
* The tweets are then stored onto the web interface
* @param teamname or playername
* @return the mentions of the user inputted
* @see tweets
**/
      function mentions(x){
        client.get('search/tweets', {q:"@"+x, count:20},
        function (err,data){
          for(var index in data.statuses){
            var tweet = data.statuses[index];
            console.log(tweet.text);
            jsonx[index] = tweet
          }
          res.end(JSON.stringify(jsonx))
        })
      }

/**
* Query the twitter api and retrieve tweets from twitter
* The tweets are then stored onto the web interface
* @param teamname or playername
* @return the tweets from the user inputted
* @see tweets
**/
      function tweets(y){
        client.get('statuses/user_timeline', {screen_name:"@"+y, count:20},
        function(err,data) {
          for(var index in data){
            var tweet = data[index];
            console.log(tweet.text);
            jsonx[index] = tweet

          }
               res.end(JSON.stringify(jsonx));
        })
      }

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
