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
            //res.write(body);
            //+console.log(body);

           var tweetsA = [];
           var jsonx = {};
            client.get('search/tweets', { q: string.teamname, count: 1},
                        function searchTweets(err, data, response) {
                        for(var index in data.statuses){
                             var tweet = data.statuses[index]; 
                               tweetsA.push(tweet.text.split(" "));
                        }
                    /* Callback function to query Twitter for statuses*/
            client.get('statuses/user_timeline', { screen_name: string.teamname, count: 10},
                        function listStatuses (err, data, response) {
                          for(var index in data){
                               var tweet = data[index]; 
                                  tweetsA.push(tweet.text.split(" "));
                          }


                            //jsonx[0]= tweetsA;
                            //console.log(jsonx);
                            //res.end(JSON.stringify(jsonx[0]));

                            var regex = /\B@\w+/gi
                            var listsb = [];
                            var dict = {};

                                  for ( i = 0 ; i < tweetsA.length; i++) {
                                     for(j = 0; j < tweetsA[i].length; j++){
                                        while((m = regex.exec(tweetsA[i][j])) != null) {
                                           listsb = listsb.concat(m[0]);
                                        }
                                          
                                        
                                         

                                      }
                                  }  

                                   

                                  for (i = 0; i < listsb.length; i++){
                                    if (listsb[i] in dict){
                                       dict[listsb[i]] += 1
                                    }else{
                                       dict[listsb[i]] = 1
                                    }   
                                    
                                  }



                                    console.log(dict)                                     
                   
                      
              });

            
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