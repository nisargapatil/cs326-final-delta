'use strict';

function select(id){
    // document.getElementById(id).classList.add("active");
    if(id=="Op1"){
        window.location = "foodRatePage.html";
    }
    if(id=="Op3"){
        window.location = "entertainmentRatePage.html";
    }
    if(id=="Op2"){
        window.location = "travelRatePage.html";
    }
}


document.getElementById("Op1").addEventListener('click', ()=>select("Op1"));
document.getElementById("Op2").addEventListener('click', ()=>select("Op2"));
document.getElementById("Op3").addEventListener('click', ()=>select("Op3"));