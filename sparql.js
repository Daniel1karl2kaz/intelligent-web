var protocol = require('http');
var static = require('node-static');
var util = require('util');
var url = require('url');
var SparqlClient = require('sparql-client');
var endpoint = "http://dbpedia.org/sparql";
var querystring = require('querystring');
var Promise = require("bluebird");

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

function sparqlquery(teamname) {
var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
"PREFIX foaf: <http://xmlns.com/foaf/0.1/>"+
"PREFIX dbp: <http://dbpedia.org/property/>"+
"PREFIX dbo: <http://dbpedia.org/ontology/>"+
"SELECT ?club_name ?description ?players ?player_image ?player_name ?player_pos ?player_position ?player_birthdate ?manager ?manager_image ?manager_name ?stadium ?stadium_name ?stadium_image ?stadium_description"+
"WHERE {"+
  "?club dbp:clubname ?club_name."+
  "?club dbo:abstract ?description."+
  "?club dbp:name ?players."+
  "?players dbo:thumbnail ?player_image."+
  "?players dbp:fullname ?player_name."+
  "?players dbo:position ?player_pos."+
  "?player_pos rdfs:label ?player_position."+
  "?players dbo:birthDate ?player_birthdate."+
  "?club dbo:manager ?manager."+
  "?manager dbo:thumbnail ?manager_image."+
  "?manager dbp:name ?manager_name."+
  "?club dbo:ground ?stadium."+
  "?stadium dbp:name ?stadium_name."+
  "?stadium dbo:thumbnail ?stadium_image."+
  "?stadium dbo:abstract ?stadium_description."+
  "FILTER (lang(?description) = 'en')"+
  "FILTER (lang(?player_position) ='en')"+
  "FILTER (lang(?stadium_description) ='en')"+
"}"
var client = new SparqlClient(endpoint);
console.log("Query to " + endpoint);
console.log("Query: " + query);
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
/**var retrieveData = function(){
  var teamname = '';
  if (string.teamone != '') {
    teamname += string.teamone + ' ';
  }
  if (string.teamtwo != ''){
    teamname += string.teamtwo;
  }
  var promise = Promise.join(sparqlquery(teamname),
    function(rdf){
      res.end(JSON.stringify({rdf:rdf}))
    });
}
retrieveData();**/
sparqlquery(string.teamone);
//sparqlquery(string.teamtwo);

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
