'use strict';

let bool = false;

function select(id){
    bool = true;
    console.log("hi",document.getElementById(id));
    document.getElementById(id).classList.add("active");
}

function unselect(id){
    if(bool){
        document.getElementById(id).classList.remove("active");
    }
}

document.getElementById("Op1").addEventListener('click', ()=>select("Op1"));
document.getElementById("Op2").addEventListener('click', ()=>select("Op2"));
document.getElementById("Op3").addEventListener('click', ()=>select("Op3"));