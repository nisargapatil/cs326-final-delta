'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { readFile, writeFile, readFileSync, existsSync, fstat } from 'fs';
import { v4 as uuid } from 'uuid';
import { write, update_user, update_product, update_vote, find, remove } from './database.js';
import pkg from 'pg';
import path from 'path';

let database = {};
let product_id;
let user_id;
let port = process.env.PORT || 8080;
let session_id = 0x10000;
let sessions = [];

let secrets;
let db_url;

if (process.env.DATABASE_URL != null && process.env.DATABASE_URL != null) {
    db_url = process.env.DATABASE_URL;
}
else {
    if (existsSync("secrets.json")) {
        secrets = JSON.parse(readFileSync("secrets.json"));
         db_url = secrets.db_url;
    }
    else {
        db_url = "";
    }
}

// console.log(db_url);

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



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

function saveImage(imageFile, image) {
    let index = imageFile.lastIndexOf(".");
    let extension = "";
    let id = 0;
    let file_name = "";
    let file_path = "";
    
    if (index > 0) {
        extension = imageFile.slice(index + 1);
        file_name = imageFile.slice(0, index);
        file_path = path.join("./imgs/", file_name + "_" + (id++) + "." + extension);
        while (existsSync(file_path)) {
            file_path = path.join("./imgs/", file_name + "_" + (id++) + "." + extension);        
        }
        // strip off the data: url prefix to get just the base64-encoded bytes
        let data = image.replace(/^data:image\/\w+;base64,/, "");
        let buf = Buffer.from(data, 'base64');
        writeFile(file_path, buf, function(err) {
            if (err) throw err;
        });
    }

    return file_path;
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);
    if (parsed.pathname === '/createUser') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            let param = {};
            const data = JSON.parse(body);
            user_id = uuid();
            update_user(database, data, user_id);
            write(database);
            param['username'] = data.name;
            res.writeHead(200);
            res.write(JSON.stringify(param));
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
                sessions.push(session_id);
                res.writeHead(200, {'Set-Cookie': 'session_id=' + (session_id++)});
                res.write(JSON.stringify(param));
            }
            else {
                res.writeHead(404);
                res.write('Error creating user ' + data.username);
            }
            res.end();
        });
    }
    else if (parsed.pathname === '/logout') {
        let body = '';
        console.log("logout");
        req.on('data', data => body += data);
        req.on('end', () => {
            res.end();
        });
    }
    else if (parsed.pathname === '/addProduct') {
        let body = '';
        let prod;
        let image_path;
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            product_id = uuid();
            if (data.image_file != null && data.image_file.length > 0) {
                image_path = saveImage(data.image_file, data.image);
                if (image_path != null) {
                    data.image = image_path;
                }
                else {
                    data.image = "";
                }
            }
            else {
                data.image = "";
            }

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
    else if (parsed.pathname === '/db'){
            try {
              const client = await pool.connect();
              const result = await client.query('SELECT * FROM products');
              console.log("hi");
              res.render('/db', result );
              client.release();
            } catch (err) {
              console.error(err);
              res.write("Error " + err);
            }
            res.end();
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
        else if (/^\/[a-zA-Z0-9\-\.\_\/]*.png$/.test(req.url.toString())) {
            sendFileContent(res, req.url.toString().substring(1), "image/png");
        }
        else if (/^\/[a-zA-Z0-9\-\.\_\/]*.gif$/.test(req.url.toString())) {
            sendFileContent(res, req.url.toString().substring(1), "image/gif");
        }
        else if (/^\/[a-zA-Z0-9\-\.\_\/]*.jpeg$/.test(req.url.toString())) {
            sendFileContent(res, req.url.toString().substring(1), "image/jpeg");
        }
        else {
            res.writeHead(404);
            res.write('Page Not Found!');
            res.end();

        }
    }

}).listen(port);

