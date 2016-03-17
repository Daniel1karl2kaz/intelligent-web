var protocol = require('http');
var static = require('node-static');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var Twit = require('twit');



var client = new Twit({
  consumer_key: 'QQY9a1KOfB9f9yrDu5TPYNxM1',
  consumer_secret: 'KFcrYRVEAou07gQwrjNUmHUsJInLa7kz8TdeCMaxSjC3sD0EEM',
  access_token: '312094689-JpmZ9EJwxUUmZErdzTbagA5zlnndyyXj4ckOVQtE',
  access_token_secret: 'S6U36toKMU9FZNriCh2MqM4ZbYzbnzQ65l8w6m0ydeqEe'
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

            if (string.checktweet1 == 'on') {
              client.get('statuses/user_timeline', {screen_name:string.teamname, count:1},
                function(err,data,response) {
                  for(var index in data){
                      var tweet = data[index];
                      console.log(' ');
                      console.log(tweet.text);
                      //tweets(tweet);
                  }
                })
            }
            if (string.checkmentions1 == 'on'){
              client.get('search/tweets', {q:"@"+string.teamname, count:4},
                function(err,data,response){
                  for(var index in data.statuses){
                    var tweet = data.statuses[index];
                    //console.log(body);
                    console.log(tweet.text);
                    console.log(' ');
                    //tweets(tweet);
                  }
                })
            }
            if (string.checktweet2 == 'on'){
              client.get('statuses/user_timeline', {screen_name:string.playername, count:3},
                function(err,data,response) {
                  for(var index in data){
                      var tweet = data[index];
                     // console.log(body);
                      console.log(tweet.text);
                      console.log(' ');
                      //tweets(tweet);
                  }
                })
            }
            if (string.checkmentions2 == 'on'){
              client.get('search/tweets', {q:"@"+string.playername, count:1},
               function(err,data,response){
                for(var index in data.statuses){
                  var tweet = data.statuses[index];
                   console.log(tweet.text);
                   console.log(' ');

                  //tweets(tweet);
                }
              })
            }

        // function tweets(tweet){
        //     var lists = []
        //     var listsb = []
        //     lists = lists.push(tweet.text);
            
        //     var regex = /\w+/i;

        //     for ( i = 0 ; i < lists.length; i++) {
        //         console.log(lists[i])
        //     }  
            
            
        // }

        // });
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