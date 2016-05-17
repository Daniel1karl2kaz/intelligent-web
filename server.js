/**
* Client variable is an object of the twitter api
* Objects in the client include the consumer_key, consumer_secret, access_token, access_token_secret
* @param consumer_key
* @param consumer_secret
* @param access_token
* @param access_token_secret
**/

var protocol = require('http');
var static = require('node-static');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var Twit = require('twit');
var mysql = require('mysql');
var async = require('async');
var MongoClient = require('mongodb').MongoClient
var mongodb = require('mongodb')

var dan ='mongodb://localhost:27017/daniel';



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

var twetions = function(tweet){        
  MongoClient.connect(dan, function (err,db) {
  if (err){
    console.log('Unable to connect to mongodb',err);
  }else {
    console.log('connection established at ',dan);
    var collection = db.collection('twitter');
    var query = tweet
    collection.insert(query,function (err,result) {
      if (err){
        console.log("data wasnt added",err);
      }else {
        console.log('inserted into collection');
      }
      //db.close();
    })
  }
})        
}


function querydb(){
  MongoClient.connect(dan, function (err,db) {
  if (err){
    console.log('Unable to connect to mongodb',err);
  }else {
    console.log('connection established at ',dan);
    var collection = db.collection('twitter');
    var query = ({"entities.user_mentions.screen_name" :string.teamname});
    collection.find(query).toArray(function (err,result) {
      if (err){
        console.log("data was not added",err);
      }else {
        //console.log()
        res.end(JSON.stringify(result));
        console.log('queried collection');
      }
      db.close();
    })
  }
})   
}  
   
         
        


    


 
    
        jsonx = {};
        jsonz = {};

function flickrapi(query, callback){
  return new Promise(function(resolve){
  flickr.get("photos.search", {"text": query, format: "json", page:1, per_page: 200},
          function(err, data){
            console.log("resolving with photos");
          resolve(data);
  });
});
}
      function search_everything(query) {
        return new Promise(function(resolve){
          client.get('search/tweets', {q:query, count:100},
            function (err,data){
              var myTweetsArray = [];
              for(var index in data.statuses){
                var tweet = data.statuses[index];
                myTweetsArray[index] = tweet
              }
      
            console.log("resolving with tweets");
             resolve(myTweetsArray);
            })
          });
        }
                var doSometing = function(){
                  console.log(string);

               var query = '';
               if  (string.checktweet1 == 'on'){
                query  += string.teamname+' ';
               }
               if (string.checkmentions1 == 'on'){
                query += '@'+string.teamname+' ';
               }
               if (string.checkmentions2 == 'on'){
                query += '@'+string.playername+' ';
               }
               if (string.checktweet2 == 'on'){
                query += string.playername;
               }

               var promise = Promise.join(search_everything(query), flickrapi(query),
                function(tweets, flickr){
                  res.end(JSON.stringify({tweets:tweets, flickr:flickr}));
                });
              }
              doSometing()
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
