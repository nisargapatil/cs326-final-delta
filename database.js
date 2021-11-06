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
    else{
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

export function remove(db,info){
    return (db.products.filter((product) => { return product.name !== info.name }));
}
    
    




