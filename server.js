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
    else if (parsed.pathname === './productInfo'){
        //body stores product name
        let body = '';
        //body stores the data which is name
        req.on('data', data => body += data);
        //empty object to store the product to return 
        let productObject = [];
        //stores name 
        let name = JSON.parse(body);
        //loops the database to find the product with the matching product name
        for(let i = 0; i<database.products.length; i++){
            if(name==database.products[i].name){
                productObject = database.products[i];
                break;
            }
        }
        //returns the product
        res.write("Product returned");
        res.end(JOSN.stringify(productObject));
    }

    else if(parsed.pathname === './deleteProduct'){
        //body stores product name
        let body = '';
        //body stores the data which is name
        req.on('data', data => body += data);
        req.on('end', () => {
        const name = JSON.parse(body);
        //loops the database to find the product with the matching product name
        for(let i = 0; i<database.products.length; i++){
            if(name==database.products[i].name){
                productObject = database.products[i];
                delete database.products[i];
                break;
            }
        }
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

