'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { writeFile, readFileSync, existsSync } from 'fs';
import { v4 as uuid } from 'uuid';


let database = {};
let product_id;
let user_id;

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
    else if (parsed.pathname === '/productInfo') {
        let body = '';
        req.on('data', data => body += data);
        let productObject = [];
        //stores name 
        let name = JSON.parse(body);
        //loops the database to find the product with the matching product name
        for (let i of database.products) {
            if (name === i[name]) {
                productObject = i;
                break;
            }
        }
        //returns the product
        res.write("Product returned");
        res.write(JSON.stringify(productObject));
        res.end();
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
}).listen(8080);

