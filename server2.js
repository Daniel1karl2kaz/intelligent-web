// definition of all the packages required
var protocol = require('http'); //http module
var static = require('node-static'); //static module
var util = require('util'); //util module
var url = require('url'); //url module
var querystring = require('querystring');
var Twit = require('twit'); //twit module
var Flickr = require("node-flickr"); //flickr module
// keys required to query flickr flickr api
var keys = {"api_key": "91e0dfe1db951b61d1b1e18b39947a28"}
flickr = new Flickr(keys);
var MongoClient = require('mongodb').MongoClient //mongoclient module
var mongodb = require('mongodb') //mongo database module
var Promise = require("bluebird"); //promise module
var SparqlClient = require('sparql-client'); //SparqlClient module
var endpoint = "http://dbpedia.org/sparql"; //URL for dpbedia queries
// keys and access tokens required to query twitter api
var client = new Twit({
  consumer_key: 'QQY9a1KOfB9f9yrDu5TPYNxM1',
  consumer_secret: 'KFcrYRVEAou07gQwrjNUmHUsJInLa7kz8TdeCMaxSjC3sD0EEM',
  access_token: '312094689-JpmZ9EJwxUUmZErdzTbagA5zlnndyyXj4ckOVQtE',
  access_token_secret: 'S6U36toKMU9FZNriCh2MqM4ZbYzbnzQ65l8w6m0ydeqEe'
});
// creating a new static Server
var file = new (static.Server)();
// porn number which the localhost listens to
var portNo = 3001;
//creating a new Server
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
      //variable that retrieves the json information parsed from the html
      var string = JSON.parse(body);
      res.writeHead(200, {"Content-Type": "application/json"});
      /**
      * This function is used to retrieve images using the flickr api
      * The query argument is data that is to be queried from the flickr api
      * The callback function is an asynchronous element
      * @param query argument is data that is to be queried from the flickr api
      * @param callback function is an asynchronous element
      * @return images from flickr
      */
      function flickrapi(query, callback){
        //promise function used to handle callback
        return new Promise(function(resolve){
          // using the flick api search the query and retrieve 200 images per page
          flickr.get("photos.search", {"text": query, format: "json", page:1, per_page: 200},
            function(err, data){
              // show on the console that the images are being resolved
              console.log("resolving with photos");
             //using the resolve method, resolve the data to handle callback
             resolve(data);
           });
        });
      }
      /**
      * This function is used to search and retrieve tweets using the twitter api
      * The query argument is the data that is to be retrieved from twitter
      * @param query argument is the data that is to be retrieved from twitter
      * @return tweets from twitter that match the particular query
      */
      function search_everything(query) {
        //promise function used to handle callback
        return new Promise(function(resolve){
          // using the twitter api search the query and retrieve 5 tweets
          client.get('search/tweets', {q:query, count:5},
            function (err,data){
              var myTweetsArray = []; //list to store tweets
              for(var index in data.statuses){
                var tweet = data.statuses[index];
                myTweetsArray[index] = tweet
              }
              // show on the console that the tweets are being resolved
             console.log("resolving with tweets");
             //using the resolve method, resolve the data to handle callback
             resolve(myTweetsArray);
           })
        });
      }
      /**
      * This function is used to retrieve all the data inputed into the form
      * it is used to handle the data retrived from twitter and flickr asynchronously
      * @return the data retrieved from the query
      */
      var resolveData = function(){
        //print to the console the elements of the form
        console.log(string);
        //query variable used to store the queries recieved
        var query = '';
        //if the checkbox for team tweet is ticked
        if  (string.checktweet1 == 'on'){
        //add the team name to the query
          query  += string.teamname+' ';
        }
        //if the checkbox for team mentions is ticked
        if (string.checkmentions1 == 'on'){
        //add the team name to the query
          query += '@'+string.teamname+' ';
        }
        //if the checkbox for player mentions is ticked
        if (string.checkmentions2 == 'on'){
        //add the team name to the query
          query += '@'+string.playername+' ';
        }
        //if the checkbox for player tweets is ticked
        if (string.checktweet2 == 'on'){
        //add the player name to the query
          query += string.playername+ ' ';
        }
        //if the textbox for hastag is not empty
        if (string.hashtag != ''){
        //add the hashtag to the query
          query += string.hashtag+ ' ';
        }
        //if the textbox for keyword is not empty
        if (string.keyword != ''){
        //add the keyword to the query
          query +=string.keyword;
        }
        // this promise method is used to handle the data retieve from twitter and flickr
        // it retrives both data and sends it to the web interface
        var promise = Promise.join(search_everything(query), flickrapi(query),
          function(tweets, flickr){
            res.end(JSON.stringify({tweets:tweets, flickr:flickr}));
          });
      }
      resolveData();
    });
  }
 else if ((req.method == 'POST') && (pathname == '/playerFile.html')){
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
    //variable that retrieves the json information parsed from the html
    var string = JSON.parse(body);
    // print to the console the data retrieved form the form
    console.log(string);
    res.writeHead(200, {"Content-Type": "application/json"});
    /**
    * This function was implemented to run a sparql query on a particular player
    * The playername argument is the name of the player that is to be queried through dbpedia
    * @param playername argument is the name of the player that is to be queried through dbpedia
    * @return for each player it retrieves the name,image,description,birth date, current club
    * player height, number, position and goals scored from the relevan dbpedia query
    */
    function playerQuery(playername) {
      /**
      This variable describes the sparql query used to retrieve the necessary dbpedia data
      the necessary prefixes are defined and the necassry data is retrieved
      */
      var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
      "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
      "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"+
      "PREFIX dbp: <http://dbpedia.org/property/>"+
      "PREFIX dbo: <http://dbpedia.org/ontology/>"+
      //SELECT statement of what is to be returned
      "SELECT ?name ?image ?description ?birthdate ?birthplace ?currentclub ?club ?height ?number ?player_position ?position ?goals"+
      "WHERE {"+
      "?player dbp:fullname ?name."+ //retrieve the players name
      "?player dbo:thumbnail ?image."+ //retrieve the players image
      "?player dbo:abstract ?description."+ //retrieve the players description
      "?player dbp:birthDate ?birthdate."+ //retrieve the players birthdate
      "?player dbp:birthPlace ?birthplace."+ //retrieve the players birth place
      "?player dbp:currentclub ?currentclub."+ //retrieve the players current club
      "?currentclub dbp:clubname ?club."+ //retrieve the players club form currentClub
      "?player dbo:height ?height."+ //retrieve the players height
      "?player dbp:clubnumber ?number."+ //retrieve the players number
      "?player dbo:position ?player_position."+ //retrieve the player_position
      "?player_position rdfs:label ?position."+ //use the player_postion to get the position
      "?player dbp:goals ?goals."+ // retrieve the goals scored by the player
      "FILTER (lang(?description) = 'en')"+ //filter the description language to only english
      "FILTER (lang(?name) ='en')"+   //filter the player name language to only english
      "FILTER (lang(?position) ='en')"+ //filter the position language to only english
      "}"
      //query to the dbpedia sparql page
      var client = new SparqlClient(endpoint);
      //print to the console the endpoint
      console.log("Query to " + endpoint);
      //print to the console the query statement
      console.log("Query: " + query);
      //retrive the query using the playername argument and parse the data onto the web interface
      client.query(query)
      .bind('player', '<http://dbpedia.org/resource/'+playername+'>')
      .execute(function(error, results) {
        process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");1
        var player =  {"player":'http://dbpedia.org/resource/'+playername}
        rdfjson = [results];
        rdfjson.push(player);
        res.end(JSON.stringify(rdfjson));
      });
    }
    /**
    * This function was implemented to run a sparql query on a particular team
    * The teamname argument is the name of the team that is to be queried through dbpedia
    * @param teamname argument is the name of the team that is to be queried through dbpedia
    * @return for each team it retrieves the name,stadium,manager,players and their info from the relevant dbpedia
    */
    function teamQuery(teamname) {
      /**
      This variable describes the sparql query used to retrieve the necessary dbpedia data
      the necessary prefixes are defined and the necassry data is retrieved
      */
      var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
      "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
      "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"+
      "PREFIX dbp: <http://dbpedia.org/property/>"+
      "PREFIX dbo: <http://dbpedia.org/ontology/>"+
      //SELECT statement of what is to be returned
      "SELECT ?club_name ?description ?players ?player_image ?player_name ?player_pos ?player_position ?player_birthdate ?manager ?manager_image ?manager_name ?stadium ?stadium_name ?stadium_image ?stadium_description"+
      "WHERE {"+
      "?club dbp:clubname ?club_name."+ //retrieve the team name
      "?club dbo:abstract ?description."+ //retrieve the team description
      "?club dbp:name ?players."+ //retrieve the teams players
      "?players dbo:thumbnail ?player_image."+ //retrieve the players image
      "?players dbp:fullname ?player_name."+ //retrieve the players name
      "?players dbo:position ?player_pos."+ //retrieve the players position
      "?player_pos rdfs:label ?player_position."+ //retrieve the players position
      "?players dbo:birthDate ?player_birthdate."+ //retrieve the players birth date
      "?club dbo:manager ?manager."+ //retrieve the teams manager
      "OPTIONAL{?manager dbo:thumbnail ?manager_image.}"+ //retrieve the manager image
      "OPTIONAL{?manager dbp:name ?manager_name.}"+ //retrieve the manager name
      "?club dbo:ground ?stadium."+ //retrieve the team stadium
      "OPTIONAL{?stadium dbp:name ?stadium_name.}"+ //retrieve the stadium name
      "OPTIONAL{?stadium dbo:thumbnail ?stadium_image.}"+ //retrieve the stadium image
      "OPTIONAL{?stadium dbo:abstract ?stadium_description.}"+ //retrieve the stadium description
      // filter the language to english
      "FILTER (lang(?description) = 'en')"+
      "FILTER (lang(?player_position) ='en')"+
      "FILTER (lang(?stadium_description) ='en')"+
      "}"
      //query to the dbpedia sparql page
      var client = new SparqlClient(endpoint);
      //print to the console the endpoint
      console.log("Query to " + endpoint);
      //print to the console the query
      console.log("Query: " + query);
      //retrive the query using the teamname argument and parse the data onto the web interface
      client.query(query)
      .bind('club', '<http://dbpedia.org/resource/'+teamname+'>')
      .execute(function(error, results) {
        process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");1
        var club =  {"club":'http://dbpedia.org/resource/'+teamname}
        rdfjson = [results]
        rdfjson.push(club)
        res.end(JSON.stringify(rdfjson))
      });
    }
    // if the checkbox for team is on
    if (string.team == 'on'){
      //print to the console the team queried
      console.log(string.player);
      //run the teamQuery function on the team inputted into the form
      teamQuery(string.player);
    }
    // if the checkbox for player is on
    if (string.play == 'on'){
      //print to the console the player queried
      console.log(string.player);
      //run the playerQuery function on the player inputted into the form
      playerQuery(string.player);
    }
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
