var http = require('http');
var url = require('url');
var querystring = require('querystring');
var {info, error} = require('./modules/my-log');
var consts = require('./utils/consts');
var firebas = require('../libs/firebase')
var {countries} = require('countries-list');

var server = http.createServer(function(request, response){

    var parsed = url.parse(request.url);
    console.log('PARSED: ', parsed);

    var pathname = parsed.pathname;

    var query = querystring.parse(parsed.query);
    console.log('QUERY: ', query);

    if(pathname === '/'){
        response.writeHead(200,{'Content-type': 'text/html'});
        response.write('<html><body><p>HOME PAGE</p></body></html>');
        response.end();
    }else if(pathname === '/exit'){
        response.writeHead(200,{'Content-type': 'text/html'});
        response.write('<html><body><p>BYE</p></body></html>');
        response.end();
    }else if(pathname === '/info'){
        var result = info(pathname);
        response.writeHead(200,{'Content-type': 'text/html'});
        response.write(result);
        response.end();
    }else if(pathname === '/country'){
        response.writeHead(200,{'Content-type': 'application/json'});
        response.write(JSON.stringify(countries[query.code]));
        response.end();
    }else if(pathname === '/error'){
        var result = error(pathname);
        response.writeHead(200,{'Content-type': 'text/html'});
        response.write(result);
        response.end();
    }else{
        response.writeHead(404,{'Content-type': 'text/html'});
        response.write('<html><body><p>NOT FOUND</p></body></html>');
        response.end()

    }
    
})

server.listen(4000);
console.log("Running on port 4000");