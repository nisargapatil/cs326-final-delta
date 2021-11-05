// 'use strict';
// let http = require('http');
// let url = require('url');
// let fs = require('fs');
// const JSONfile = './data.json';
// let product = {};
// let user = {};

// function addProduct(name, response) {
//     product[name] = 0;
//     fs.writeFileSync(JSONfile, JSON.stringify(product));
//     response.write("<h1> counter " + name + " created </h1>");
//     response.end();
// }

// function errorCounter(name, response) {
//     response.write("<h1> error: counter " + name + " not found. </h1>");
//     response.end();
// }

// function lookProduct(name, response) {
//     reload(JSONfile);
//     response.write("<h1> counter [" + name + "] = " + product[name] + " </h1>");
// }

// function updateProduct(name, response) {
//     counter[name] += 1;
//     fs.writeFileSync(JSONfile, JSON.stringify(product));
//     response.write("<h1> counter " + name + " updated </h1>");
// }

// function deleteProduct(name, response) {
//     delete product[name];
//     fs.writeFileSync(JSONfile, JSON.stringify(product));
//     response.write("<h1> counter " + name + " deleted </h1>");
// }

// function reload(filename) {
//     if (fs.existsSync(filename)) {
//         // READ IN COUNTER FROM THE FILE -- your code goes here
//         product = JSON.parse(fs.readFileSync(filename));
//     }
//     else {
//         product = {};
//     }
// }

// function userSignup(name, response){
//     user[name] = 0;
//     fs.writeFileSync(JSONfile, JSON.stringify(name));
//     response.write("<h1> counter " + name + " created </h1>");
//     response.end();
// }

// function login(){

// }


// const headerText = { "Content-Type": "text/html" };
// let server = http.createServer();
// server.on('request', async (request, response) => {
//     response.writeHead(200, headerText);
//     let options = url.parse(request.url, true).query;
//     response.write(JSON.stringify(options));
//     if (request.url.startsWith("/product/add")) {
//         addProduct(options.name, response);
//         return;
//     }
//     if (!(options.name in counter)) {
//         errorCounter(options.name, response);
//         return;
//     }
//     if (request.url.startsWith("/product/Lookup")) {
//         lookProduct(options.name, response);
//     }
//     else if (request.url.startsWith("/user/signup")) {
//         updateCounter(options.name, response);
//     }
//     else if (request.url.startsWith("/delete")) {
//         deleteCounter(options.name, response);
//     }
//     else {
//         response.write("no command found.");
//     }
//     response.end();
// });

// server.listen(8080);

'use strict';
const express = require('express');
const app = express();

app.use(express.json()); // lets you handle JSON input

const port = 3000;

const datastore = {};

app.get('/product/add', (req, res) => {
  res.send('Hello World!')
});

app.get('/product/Lookup', (req, res) => {
  res.send('Set.');
});

app.get('/read', (req, res) => {
  res.send(`key = ${k}, value = ${v}`);
});

//   curl -d '{ "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/read/x
app.get('/read/:key', (req, res) => {
  res.send();
});

//   curl -d '{ "key" : "x", "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/pcreate
app.post('/pcreate', (req, res) => {
  res.send('Set.');
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
