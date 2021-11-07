async function getJSON(url) {
    var payload = {
        name: 'Pizza'
    };

    let data = new FormData();
    data.append('data', JSON.stringify(payload));
    let res = fetch(url,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/json'},
            body: JSON.stringify({name: 'noodles'})
        })
        .then (function(res) {return res; })
        console.log(res);
    return res;
}

async function render() {
    let pageIndex = window.location.href.indexOf("page=");
    if (pageIndex > 0) {
        let page = window.location.href.substr(pageIndex + 5);
        if (page === 'foodRatePage') {
            let url = '/productInfo';
            let res = await getJSON(url);
            let json = await res.text();
            let obj = JSON.parse(json);
            console.log(obj.name);
        }
    }
}
render();

 
