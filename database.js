/*
        Data types in the tables: 

        Products (id varchar(50), name text, category(text), description(text), upvote(integer), downvote(integer));

        Users (name text, password varchar(50), email text, id varchar(50));

        Products table contains the product id, name, its category(eitehr food,travel, or entertainment), description, and the no. of upvotes/downvotes it gets.
    
        Users table contains the name, password, email, and user id of all the users who log into our application.

        Example tables:

        Products:

                         id                  | name  | category | description | upvote | downvote 
        -------------------------------------+-------+----------+-------------+--------+----------
        0dae2f90-f25b-4a2b-b261-03057292938a | Paris | Travel   | a place     |      8 |       11

       

        Users:
          name   | password |       email       |                 id                  
        ---------+----------+-------------------+-------------------------------------
         Nisarga | cs326    | nisarga@gmail.com | rwe2f90-f25b-4a2b-b261-03057292938b
*/


'use strict';
import { writeFile, readFileSync, existsSync } from 'fs';

export function write(db) {
    writeFile("database.json", JSON.stringify(db), err => {
        if (err) {
            console.err(err);
        }
    });
}

export function update_user(db, info, num) {
    db.users.push({
        name: info.name,
        password: info.password,
        email: info.email,
        id: num
    });
}

export function update_product(db, info, num) {
    db.products.push({
        name: info.name,
        category: info.category,
        description: info.description,
        details: info.details,
        id: num,
        image: info.image,
        upVote: 0,
        downVote: 0
    });
}

export function update_vote(db, info, bool) {
    let obj = find(db, info);
    if (bool) {
        if (obj.upVote) {
            obj.upVote += 1;
        }
        else {
            obj.upVote = 1;
        }
    }
    else {
        if (obj.downVote) {
            obj.downVote += 1;
        }
        else {
            obj.downVote = 1;
        }
    }
}

export function find(db, info) {
    return db.products.find((product) => { return product.name === info.name });
}

export function remove(db, info) {
    return (db.products.filter((product) => { return product.name !== info.name }));
}







