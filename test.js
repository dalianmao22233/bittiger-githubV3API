// var http = require("http");
//
// function onRequest(request, response) {
//     console.log("Request received.");
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.write("Hello World");
//     response.end();
// }
//
// http.createServer(onRequest).listen(8888);
//
// console.log("Server has started.");
//
// var http = require("http");
//
// var server = http.createServer();
// // server.listen(8888);
//
// function say(word) {
//     console.log(word);
// }
//
// function execute(someFunction, value) {
//     someFunction(value);
// }
//
// execute(say, "Hello");

// var http = require("http");
//
// function onRequest(request, response) {
//     console.log("Request received.");
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.write("Hello World");
//     response.end();
// }
//
// http.createServer(onRequest).listen(8888);
//
// console.log("Server has started.");

// var http = require("http");
//
// http.createServer(function(request, response) {
//     console.log("Hello world shiyuxin!!!");
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.write("Hello World");
//     response.end();
// }).listen(8888);

var http = require("http");
function start() {
    console.log("test.js begins!");

    function onRequest(request, response) {
        console.log("Request received.");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;