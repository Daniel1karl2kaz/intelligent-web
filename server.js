var protocol = require('http');
var static = require('node-static');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var Twit = require('twit');
var client = new Twit({
  consumer_key: 'EGGQgrH4lCA8xUxFuNVizTgyU',
  consumer_secret: 'Y50XRwHUntrsvcimeO3dLeJOBoLfwdjWxg3gwequw23YyfW5NL',
  access_token: '255663300-78cjb4s4cnUXPTrQKTPv63bk0qnEbrI8QNQfWQXW',
  access_token_secret: 'P7b0F6cUgf94jEu2SRFkGlWL8YuwKnVULuAlS4qpcqFEN'
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
            res.end(body);
            //console.log(string);
            if (string.checktweet1 = 'on') {
              client.get('statuses/user_timeline', {screen_name: string.teamname, count:1},
                function(err,data,response) {
                  for(var index in data){
                      var tweet = data[index];
                      console.log(body);
                      console.log(tweet.text + ' ')
                  }
                })
            }
            if (string.checkmentions1 = 'on'){
              client.get('search/tweets', {q:string.teamname, count:1 },
                function(err,data,response){
                  for(var index in data.statuses){
                    var tweet = data.statuses[index];
                    console.log(body);
                    console.log(tweet.text +'');
                  }
                })
            }
            if (string.checktweet2 = 'on'){
              client.get('statuses/user_timeline', {screen_name: string.playername, count:1},
                function(err,data,response) {
                  for(var index in data){
                      var tweet = data[index];
                      console.log(body);
                      console.log(tweet.text + ' ')
                  }
                })
            }
            if (string.checkmentions2 = 'on'){
              client.get('search/tweets', {q:string.playername, count:1},
              function(err,data,response){
                for(var index in data.statuses){
                  var tweet = data.statuses[index];
                  console.log(body);
                  console.log(tweet.text +'');
                }
              })
            }
            client.get('search/tweets', {q: string.hashtag, count:1},
            function(err,data,response){
              for(var index in data.statuses) {
                  var tweet =data.statuses[index];
                  console.log(body);
                  console.log(tweet.text+ '')
              }
            })
            client.get('serach/tweets', {q: string.keyword, count:1},
            function(err,data,response){
              for(var index in data.statuses){
                  var tweet = data.statuses[index];
                  console.log(body);
                  console.log(tweet.text +'')
              }
            })
            //console.log(body);
             /**client.get('statuses/user_timeline', {screen_name: string.teamname, count:2 },
                  function(err, data,response) {
                    for (var index in data){
                         var tweet = data[index];

                         console.log(tweet.text + ' ');
                    }
                  }) **/

              /**client.get('search/tweets', { q: string.teamname, count:5 },
                  function(err,data,response){
                    for(var index in data.statuses) {
                        var tweet =data.statuses[index];
                        console.log(tweet.text+ '')
                    }
                  }) **/
              /**client.get('search/tweets', {q: string.hashtag, count:5},
                  function (err,data,response) {
                    for (var index in data.statuses){
                          var tweet = data.statuses[index];
                      console.log(tweet.text + '');
                    }

                  })**/


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
