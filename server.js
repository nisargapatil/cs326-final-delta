'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { writeFile, readFileSync, existsSync } from 'fs';
import { v4 as uuid } from 'uuid';
import {write,update_user, update_product, update_vote, find, remove} from './database.js';

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

createServer(async (req, res) => {
    const parsed = parse(req.url, true);
    if (parsed.pathname === '/createUser') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            user_id = uuid();
            update_user(database,data,user_id);
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
            update_product(database,data,product_id);
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
            res.write("Product returned");
            res.write(JSON.stringify(find(database,obj)));
            res.end();
        });
    }
    else if (parsed.pathname === '/upvote') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            update_vote(database,obj,true);
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
            update_vote(database,obj,false);
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
            let prod = remove(database,obj);
            database.products = prod;
            write(database);
            res.writeHead(200);
            res.write("Product deleted");
            res.end();
        });
    }
    else if (parsed.pathname === '/viewPage') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const obj = JSON.parse(body);
            res.writeHead(200);
            res.write(`Viewing the page ${obj.name}`);
            res.end();
        });
    }
    else {
        res.writeHead(404);
        res.end();
    }
}).listen(port);

