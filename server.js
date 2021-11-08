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
        viewed: []
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
        let prod;
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
    else if (parsed.pathname === '/login') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            let prod;
            for (let i of database.users) {
                if (data.username === i.name &&
                    data.password === i.password) {
                    prod = i;
                    break;
                }
            }
            if (prod !== undefined) {
                let param = {};
                param['username'] = prod.name;
                res.writeHead(200);
                res.write(JSON.stringify(param));
            }
            else {
                res.writeHead(404);
                res.write('Error creating user ' + data.username);
            }
            res.end();
        });
    }
    else if (parsed.pathname === '/addProduct') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            product_id = uuid();
            update_product(database, data, product_id);
            write(database);
            // res.writeHead(200);
            // res.write("Product added");
            for (let i of database.products) {
                if (data.name === i.name) {
                    prod = i;
                    break;
                }
            }
            if (prod !== undefined) {
                res.writeHead(200);
                res.write(JSON.stringify(prod));
            }
            else {
                res.writeHead(404);
            }
            res.end();
        });
    }
    else if (parsed.pathname === '/productInfo') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            prod = find(database, obj);
            res.write(JSON.stringify(prod));
            res.end();
        });
    }
    else if (parsed.pathname === '/productSummary') {
        let body = '';
        let prod = [];
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            for (let i of database.products) {
                if (obj.category === i.category) {
                    prod.push(i);
                }
            }
            res.write(JSON.stringify(prod));
            res.end();
        });
    }
    else if (parsed.pathname === '/upvote') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            for (let i of database.products) {
                if (obj.name === i.name) {
                    if (i.upVote) {
                        i.upVote += 1;
                    }
                    else {
                        i.upVote = 1;
                    }
                    prod = i;
                    break;
                }
            }
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
            if (prod !== undefined) {
                res.writeHead(200);
                res.write(JSON.stringify(prod));
            }
            else {
                res.writeHead(404);
            }
            res.end();
        });
    }
    else if (parsed.pathname === '/downvote') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            for (let i of database.products) {
                if (obj.name === i.name) {
                    if (i.downVote) {
                        i.downVote += 1;
                    }
                    else {
                        i.downVote = 1;
                    }
                    prod = i;
                    break;
                }
            }
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
            if (prod !== undefined) {
                res.writeHead(200);
                res.write(JSON.stringify(prod));
            }
            else {
                res.writeHead(404);
            }
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
        sendFileContent(res, file, content);
    }
    else {
        if (/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())) {
            sendFileContent(res, req.url.toString().substring(1), "text/css");
        }
        else if (/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())) {
            sendFileContent(res, req.url.toString().substring(1), "text/javascript");
        }
        else if (/^\/[a-zA-Z0-9\-\.\_\/]*.jpg$/.test(req.url.toString())) {
            sendFileContent(res, req.url.toString().substring(1), "image/jpg");
        }
        else if (/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())) {
            sendFileContent(res, req.url.toString().substring(1), "image/png");
        }
        else {
            res.writeHead(404);
            res.write('Page Not Found!');
            res.end();

        }
    }

}).listen(port);

