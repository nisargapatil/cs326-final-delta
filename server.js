'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { readFile, writeFile, readFileSync, existsSync, fstat } from 'fs';
import { v4 as uuid } from 'uuid';
import { write, update_user, update_product, update_vote, find, remove } from './database.js';
import path from 'path';
import pgp from 'pg-promise';

let product_id;
let user_id;
let secrets;
let port = process.env.PORT || 8080;
let session_id = 0x10000;
let sessions = [];
let user;
let password;
let db_url;

if (!process.env.PASSWORD) {
    secrets = JSON.parse(readFileSync('secret.json'));
    password = secrets.password;
} else {
    password = process.env.PASSWORD;
}
if (!process.env.USER) {
    secrets = JSON.parse(readFileSync('secret.json'));
    user = secrets.user;
} else {
    user = process.env.USER;
}
if (!process.env.DATABASE_URL) {
    db_url = `postgres://${user}:${password}@localhost/`;
}
else {
    db_url = process.env.DATABASE_URL;
}

const db = pgp()(db_url);

async function connectAndRun(task) {
    let connection = null;

    try {
        connection = await db.connect();
        return await task(connection);
    }
    catch (e) {
        throw e;
    }
    finally {
        try {
            connection.done();
        }
        catch (ignored) {
        }
    }
}

async function addProduct(id, name, category, description, upvote, downvote) {
    await connectAndRun(db => db.none('INSERT INTO products VALUES ($1, $2, $3,$4,$5,$6);', [id, name, category, description, upvote, downvote]));
}

async function deleteProduct(name) {
    await connectAndRun(db => db.result('DELETE FROM products WHERE name = ($1);', [name]));
}

async function addUser(name, pw, email, id) {
    await connectAndRun(db => db.none('INSERT INTO users VALUES ($1, $2, $3, $4);', [name, pw, email, id]));
}

async function upVote(name) {
    await connectAndRun(db => db.any('UPDATE products SET upvote = upvote+1 where name = ($1);', [name]));
}

async function downVote(name) {
    await connectAndRun(db => db.any('UPDATE products SET downvote = downvote-1 where name = ($1);', [name]));
}

async function findProduct(name) {
    await connectAndRun(db => db.none('SELECT * FROM products WHERE name = ($1);', [name]));
}

async function findUser(name) {
    await connectAndRun(db => db.none('SELECT * FROM users WHERE name = ($1);', [name]));
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
        writeFile(file_path, buf, function (err) {
            if (err) throw err;
        });
    }

    return file_path;
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);
    if (parsed.pathname === '/createUser') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', async () => {
            let param = {};
            const data = JSON.parse(body);
            user_id = uuid();
            addUser(data.name, data.password, data.email, user_id);
            res.writeHead(200);
            res.end();
        });
    }
    else if (parsed.pathname === '/login') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            let u = findUser(data.name);
            if (u !== null && u.password === data.password) {
                let param = {};
                param['username'] = prod.name;
                sessions.push(session_id);
                res.writeHead(200, { 'Set-Cookie': 'session_id=' + (session_id++) });
            }
            else {
                res.writeHead(404);
                res.write('Error logging in as user ' + data.name);
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
            if (data.image_file != null) {
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

            addProduct(product_id, data.name, data.category, data.description, 0, 0);
            let prod = JSON.parse(findProduct(data.name));
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
            prod = JSON.parse(findProduct(obj.name));
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
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            let prod = JSON.parse(findProduct(obj.name));
            upVote(obj.name);
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
            downVote(obj.name);
            let prod = JSON.parse(findProduct(obj.name));
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
            deleteProduct(obj.name);
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

