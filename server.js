'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { readFile, writeFile, readFileSync, existsSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { write, update_user, update_product, update_vote, find, remove } from './database.js';

let database = {};
let product_id;
let user_id;
let port = process.env.PORT || 8080;

if (existsSync("database.json")) {
    database = JSON.parse(readFileSync("database.json"));
} else {
    database = {
        users: [],
        products: [],
        pages: ['food', 'travel', 'entertainment'],
    };
}
function sendFileContent(response, fileName, contentType) {
    readFile(fileName, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write("Not Found!");
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.write(data);
            response.end();
        }
    });
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);
    if (parsed.pathname === '/createUser') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            user_id = uuid();
            update_user(database, data, user_id);
            write(database);
            res.writeHead(200);
            res.write("User created");
            res.end();
        });
    }
    else if (parsed.pathname === '/addProduct') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            product_id = uuid();
            update_product(database, data, product_id);
            write(database);
            res.writeHead(200);
            res.write("Product added");
            res.end();
        });
    }
    else if (parsed.pathname === '/productInfo') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            res.write(JSON.stringify(find(database, obj)));
            res.end();
        });
    }
    else if (parsed.pathname === '/upvote') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            update_vote(database, obj, true);
            write(database);
            res.writeHead(200);
            res.write("Product upvoted");
            res.end();
        });
    }
    else if (parsed.pathname === '/downvote') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            update_vote(database, obj, false);
            write(database);
            res.writeHead(200);
            res.write("Product downvoted");
            res.end();
        });
    }
    else if (parsed.pathname === '/deleteProduct') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const obj = JSON.parse(body);
            let prod = remove(database, obj);
            database.products = prod;
            write(database);
            res.writeHead(200);
            res.write("Product deleted");
            res.end();
        });
    }
    else if (parsed.pathname === '/' || parsed.pathname === '/viewPage') {
        let page = 'home'
        let content = 'text/html'
        if (parsed.pathname !== '/') {
            for (const [key, value] of Object.entries(parsed.query)) {
                if (key === 'page') {
                    page = value;
                    break;
                } 
            }          
        }
        if (page.indexOf('.css') > 0) {
            content = 'text/css';
        }
        let file = 'client/' + page + ".html";
        sendFileContent(res, file, content)
    }
    else {           
        if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())){
            sendFileContent(res, req.url.toString().substring(1), "text/css");
        }
        else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
            sendFileContent(res, req.url.toString().substring(1), "text/javascript");
         }
         else if(/^\/[a-zA-Z0-9\-\.\_\/]*.jpg$/.test(req.url.toString())){
            sendFileContent(res, req.url.toString().substring(1), "image/jpg");
         }
         else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())){
            sendFileContent(res, req.url.toString().substring(1), "image/png");
         }
         else {
            res.writeHead(404);
            res.write('Page Not Found!');
            res.end();
         }
    }
}).listen(port);

