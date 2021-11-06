'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { writeFile, readFileSync, existsSync } from 'fs';
import { v4 as uuid } from 'uuid';


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

createServer(async (req, res) => {

    const parsed = parse(req.url, true);

    if (parsed.pathname === '/createUser') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            user_id = uuid();
            database.users.push({
                name: data.name,
                password: data.password,
                email: data.email,
                id: user_id
            });

            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
            res.writeHead(200);
            res.write("User created");
        });
    }
    else if (parsed.pathname === '/addProduct') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            product_id = uuid();
            database.products.push({
                name: data.name,
                category: data.category,
                description: data.description,
                details: data.details,
                id: product_id,
                upVote: 0,
                downVote: 0
            });

            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
            res.writeHead(200);
            res.write("Product added");
        });
    }
    else if (parsed.pathname === '/productInfo') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            for (let i of database.products) {
                if (obj.name === i.name) {
                    prod = i;
                    break;
                }
            }
            res.write("Product returned");
            res.write(JSON.stringify(prod));
            res.end();
        });
    }
    else if (parsed.pathname === '/upvote') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            for (let i of database.products) {
                if (obj.name === i.name) {
                    if(i.upVote){
                        i.upVote += 1;
                    }
                    else{
                        i.upVote = 1;
                    }
                }
            }
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
            res.writeHead(200);
            res.write("Product upvoted");
        });
    }
    else if (parsed.pathname === '/downvote') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            for (let i of database.products) {
                if (obj.name === i.name) {
                    if(i.downVote){
                        i.downVote += 1;
                    }
                    else{
                        i.downVote = 1;
                    }
                }
            }
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
            res.writeHead(200);
            res.write("Product downvoted");
        });
    }
    else if (parsed.pathname === '/deleteProduct') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const obj = JSON.parse(body);
            let prod = database.products.filter((product) => { return product.name !== obj.name });
            database.products = prod;
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
            res.writeHead(200);
            res.write("Product deleted");
        });
    }
    else {
        res.writeHead(404);
        res.end();
    }
}).listen(port);

