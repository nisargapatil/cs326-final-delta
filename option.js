'use strict';

function select(id){
    document.getElementById(id).classList.add("active");
}


document.getElementById("Op1").addEventListener('click', window.location = "Ratings.html");
document.getElementById("Op2").addEventListener('click', ()=>select("Op2"));
document.getElementById("Op3").addEventListener('click', ()=>select("Op3"));