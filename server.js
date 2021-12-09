'use strict';
import { createServer } from 'http';
import { parse } from 'url';
import { readFile, writeFile, readFileSync, existsSync } from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import pgp from 'pg-promise';

let product_id;
let user_id;
let port = process.env.PORT || 8080;
let session_id = 0x10000;
let sessions = [];
let user = '';
let password = '';

if (existsSync('secret.json')) {
    let secrets = JSON.parse(readFileSync("secret.json"));
    user = secrets.user;
    password = secrets.password;
}

let db_url = process.env.DATABASE_URL;

let ssl = {rejectUnauthorized: false}

let postgresConfig = {
    connectionString: db_url,
    max: 30,
    ssl: ssl
}

const db = pgp()(postgresConfig);

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

function addProductCallback(res, name) {
    let prod = {};
    prod['name'] = name;
    res.writeHead(200);
    res.write(JSON.stringify(prod));
    res.end();
}

async function addProduct(res, id, name, category, description, image_file, image, upvote, downvote) {
    try {
        const db_result = db.none('insert into products (id, name, category, description, image, upvote, downvote) values ($1, $2, $3, $4, $5, $6, $7)',
            [id, name, category, description, image, upvote, downvote])
            .then(function(result) {
                addProductCallback(res, name);
            })
            .catch(function(error) {
                console.log("Error while adding product" + error.message);
            });
    }
    catch (e) {
    }
}

async function deleteProduct(name) {
    return await connectAndRun(db => db.result('DELETE FROM products WHERE name = ($1);', [name]));
}

function addUserCallback(res, name) {
    let param = {};
    param['username'] = name;
    res.writeHead(200);
    res.write(JSON.stringify(param));
    res.end();
}

async function addUser(res, name, pw, email, id) {
    try {
        const db_result = db.none('insert into users (name, password, email, id) values ($1, $2, $3, $4)', [name, pw, email, id])
            .then(function(result) {
                addUserCallback(res, name);
            })
            .catch(function(error) {
                
            });
    }
    catch (e) {
    }
}

function upVoteCallback(res, name, count) {
    let prod = {};
    prod['name'] = name;
    prod['upvote'] = count.toString();
    console.log('Upvote count ' + prod['upvote']);
    if (prod !== undefined) {
        res.writeHead(200);
        res.write(JSON.stringify(prod));
    }
    else {
        res.writeHead(404);
    }
    res.end();
}

async function upVote(res, name, count) {
    try {
        let vote = parseInt(count, 10) + 1;
        const db_result = db.none('update products set upvote = ($1) where name = ($2)', [vote, name])
            .then(function(result) {
                upVoteCallback(res, name, vote);
            })
            .catch(function(error) {
                console.log(error.message)
            });
    }
    catch (e) {
    }
}

function selectVoteCallback(res, result, name) {
    if (result != null) {
        upVote(res, name, result[0].upvote)
    }
}

async function selectVote(res, name) {
    try {
        const db_result = db.any('select upvote from products where name = ($1) limit 1', [name])
            .then(function(result) {
                selectVoteCallback(res, result, name);
            })
            .catch(function(error) {
                console.log("selectVote " + name + ", error: " + error.message);
            });
    }
    catch (e) {
    }
}

function downVoteCallback(res, name, count) {
    let prod = {};
    prod['name'] = name;
    prod['downvote'] = count.toString();
    if (prod !== undefined) {
        res.writeHead(200);
        res.write(JSON.stringify(prod));
    }
    else {
        res.writeHead(404);
    }
    res.end();
}

async function downVote(res, name, count) {
    try {
        let vote = parseInt(count, 10) + 1;
        const db_result = db.none('update products set downvote = ($1) where name = ($2)', [vote, name])
        .then(function(result) {
            downVoteCallback(res, name, vote);
        })
        .catch(function(error) {
            console.log(error.message)
        });

    }
    catch (e) {
    }
}

function selectDownVoteCallback(res, result, name) {
    if (result != null) {
        downVote(res, name, result[0].downvote)
    }
}

async function selectDownVote(res, name) {
    try {
        const db_result = db.any('select downvote from products where name = ($1) limit 1', [name])
            .then(function(result) {
                selectDownVoteCallback(res, result, name);
            })
            .catch(function(error) {
                console.log("selectDownVote " + name + ", error: " + error.message);
                res.end();
            });
    }
    catch (e) {
    }
}

async function findProduct(name) {
    return await connectAndRun(db => db.none('SELECT * FROM products WHERE name = ($1);', [name]));
}

function findUserCallback(res, result, name, password) {
    if (result !== null && result[0].password === password) {
        let param = {};
        param['username'] = name;
        sessions.push(session_id);
        res.writeHead(200, { 'Set-Cookie': 'session_id=' + (session_id++) });
        res.write(JSON.stringify(param));
    }
    else {
        res.writeHead(404);
        res.write('Error logging in as user ' + name);
    }
    res.end();
}

async function findUser(res, user, password) {
    try {
        const db_result = db.any('select name, password from users where name = ($1) limit 1', [user])
            .then(function(result) {
                findUserCallback(res, result, user, password);
            })
            .catch(function(error) {
                console.log("Error finding user " + user + " " + password + " " + error.message);
                res.writeHead(404);
                res.end();
            });
    }
    catch (e) {
        console.log("Failed to find user");
    }
}

function productSummaryCallback(res, result, category) {
    let prod = [];
    for (let i of result) {
        if (category === i.category) {
            prod.push(i);
        }
    }
    res.write(JSON.stringify(prod));
    res.end();
}

async function productSummary(res, category) {
    try {
        const db_result = db.any('select * from products where category = ($1)', [category])
            .then(function(result) {
                productSummaryCallback(res, result, category);
            })
            .catch(function(error) {
                console.log("Error finding product summary " + error.message);
            });
    }
    catch (e) {
        console.log("Failed to select product category");
    }
}

function productInfoCallback(res, result, name) {
    if (result != null) {
        res.write(JSON.stringify(result[0]));
    }
    else {
        res.writeHead(404);
    }
    res.end();
}

async function productInfo(res, name) {
    try {
        const db_result = db.any('select * from products where name = ($1)', [name])
            .then(function(result) {
                productInfoCallback(res, result, name);
            })
            .catch(function(error) {
                console.log("Error finding product info " + error.message);
            });
    }
    catch (e) {
        console.log("Failed to find product info");
    }
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
        file_path = path.join("imgs/", file_name + "_" + (id++) + "." + extension);
        while (existsSync(file_path)) {
            file_path = path.join("imgs/", file_name + "_" + (id++) + "." + extension);
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
            const data = JSON.parse(body);
            user_id = uuid();
            addUser(res, data.name, data.password, data.email, user_id);
        });
    }
    else if (parsed.pathname === '/login') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            findUser(res, data.username, data.password);
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
        let image;
        let image_file;

        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            product_id = uuid();
            if (data.image_file != null) {
                image = saveImage(data.image_file, data.image);
                if (image === null) {
                    image = "";
                    image_file = "";
                }
            }
            else {
                image = "";
                image_file = "";
            }

            addProduct(res, product_id, data.name, data.category, data.description, image_file, image, 0, 0);
        });
    }
    else if (parsed.pathname === '/productInfo') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            productInfo(res, obj.name);
        });
    }
    else if (parsed.pathname === '/productSummary') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            productSummary(res, obj.category);
        });
    }
    else if (parsed.pathname === '/upvote') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            selectVote(res, obj.name);
        });
    }
    else if (parsed.pathname === '/downvote') {
        let body = '';
        let prod;
        req.on('data', data => body += data);
        req.on('end', () => {
            let obj = JSON.parse(body);
            selectDownVote(res, obj.name);
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

