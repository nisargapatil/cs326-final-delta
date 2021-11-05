'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { writeFile, readFileSync, existsSync } from 'fs';

let database = {};
let product_id = 0;
let user_id = 0;

if (existsSync("database.json")) {
    database = JSON.parse(readFileSync("database.json"));
} else {
    database = {
        users: [],
        products: [],
        pages: ['food', 'travel', 'entertainment']
    };
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);

    if (parsed.pathname === '/createUser') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            user_id += 1
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
            product_id += 1
            database.products.push({
                name: data.name,
                category: data.category,
                description: "null",
                details: data.details,
                id: product_id
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
    else {
        res.writeHead(404);
        res.end();
    }
}).listen(8080);

