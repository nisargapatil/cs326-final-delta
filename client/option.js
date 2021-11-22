'use strict';

function select(id){
    // document.getElementById(id).classList.add("active");
    if(id=="Op1"){
        window.location = "viewPage?page=foodRatePage";
    }
    if(id=="Op3"){
        window.location = "viewPage?page=entertainmentRatePage";
    }
    if(id=="Op2"){
        window.location = "viewPage?page=travelRatePage";
    }
}

if (isLogin()) {
    document.getElementById("Op1").addEventListener('click', ()=>select("Op1"));
    document.getElementById("Op2").addEventListener('click', ()=>select("Op2"));
    document.getElementById("Op3").addEventListener('click', ()=>select("Op3"));    
}
