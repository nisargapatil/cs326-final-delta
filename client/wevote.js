
async function getJSON(url, payload) {
    let data = new FormData();
    data.append('data', JSON.stringify(payload));
    let res = fetch(url,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        })
        .then (function(res) {return res; })
    return res;
}

async function render() {
    let pageIndex = window.location.href.indexOf("page=");
    let sepIndex = window.location.href.indexOf("&");

    if (pageIndex > 0) {
        let page;
        if (sepIndex > 0) {
            page = window.location.href.substr(pageIndex + 5, sepIndex - pageIndex - 5);
        }
        else {
            page = window.location.href.substr(pageIndex + 5);
        }
        if (page === 'foodRatePage') {
            let url = '/productSummary';
            let res = await getJSON(url, {category: 'food'});
            let json = await res.text();
            let obj = JSON.parse(json);
            let container2 = document.getElementById('container2');
            let html = '';
            for (let i=0; i < obj.length; i++) {
                let htmlSegment = `<div class="itemCard">
                <h1>${obj[i].name}</h1>
                <img src="./imgs/foodPic.jpg" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark">Upvote</button>
                <button type="button" class="btn btn-dark">Downvote</button>
                <a href="viewPage?page=foodProductPage&name=${obj[i].name}">
                    <button type="button" button type="submit" class="btn btn-dark" href="#">View</button>
                </a>
                </div>`;
                html += htmlSegment;
            }
            container2.innerHTML = html;
        }
        else if (page === 'foodProductPage') {
            let nameIndex = window.location.href.indexOf("name=");
        
            if (nameIndex > 0) {
                let name = window.location.href.substr(nameIndex + 5);
                let param = {};
                let url = '/productInfo';
                param['name'] = name;
                name = name.replace(/%20/g, " ");
                let res = await getJSON(url, param);
                let json = await res.text();
                let obj = JSON.parse(json);
                let container2 = document.getElementById('container2');
                let html = '';
                let htmlSegment = `<div class="itemCard">
                <h1>${obj.name}</h1>
                <img src="./imgs/foodPic.jpg" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark">Upvote Number</button>
                <button type="button" class="btn btn-dark">Downvote Number</button>
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                    <h3>Food Description</h3>
                    <span id="productDescription"></span>
                    ${obj.description}
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                                <h3>Other Details</h3>
                        <span id="otherDetails"></span>
                        </div>`;

                html += htmlSegment;

                container2.innerHTML = html;
            }
        }
        else if (page === 'travelRatePage') {
            let url = '/productSummary';
            let res = await getJSON(url, {category: 'Travel'});
            let json = await res.text();
            let obj = JSON.parse(json);
            let container2 = document.getElementById('container2');
            let html = '';
            for (let i=0; i < obj.length; i++) {
                let htmlSegment = `<div class="itemCard">
                <h1>${obj[i].name}</h1>
                <img src="./imgs/travelPic.jpg" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark">Upvote</button>
                <button type="button" class="btn btn-dark">Downvote</button>
                <a href="viewPage?page=travelProductPage&name=${obj[i].name}">
                    <button type="button" button type="submit" class="btn btn-dark" href="#">View</button>
                </a>
                </div>`;
                html += htmlSegment;
            }
            container2.innerHTML = html;
        }
        else if (page === 'travelProductPage') {
            let nameIndex = window.location.href.indexOf("name=");
        
            if (nameIndex > 0) {
                let name = window.location.href.substr(nameIndex + 5);
                let param = {};
                let url = '/productInfo';
                param['name'] = name;
                name = name.replace(/%20/g, " ");
                let res = await getJSON(url, param);
                let json = await res.text();
                let obj = JSON.parse(json);
                let container2 = document.getElementById('container2');
                let html = '';
                let htmlSegment = `<div class="itemCard">
                <h1>${obj.name}</h1>
                <img src="./imgs/travelPic.jpg" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark">Upvote Number</button>
                <button type="button" class="btn btn-dark">Downvote Number</button>
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                    <h3>Food Description</h3>
                    <span id="productDescription"></span>
                    ${obj.description}
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                                <h3>Other Details</h3>
                        <span id="otherDetails"></span>
                        </div>`;

                html += htmlSegment;                 

                container2.innerHTML = html;
            }
        }
        else if (page === 'entertainmentRatePage') {
            let url = '/productSummary';
            let res = await getJSON(url, {category: 'Entertainment'});
            let json = await res.text();
            let obj = JSON.parse(json);
            let container2 = document.getElementById('container2');
            let html = '';
            for (let i=0; i < obj.length; i++) {
                let htmlSegment = `<div class="itemCard">
                <h1>${obj[i].name}</h1>
                <img src="./imgs/movie.jpg" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark">Upvote</button>
                <button type="button" class="btn btn-dark">Downvote</button>
                <a href="viewPage?page=entertainmentProductPage&name=${obj[i].name}">
                    <button type="button" button type="submit" class="btn btn-dark" href="#">View</button>
                </a>
                </div>`;
                html += htmlSegment;
            }
            container2.innerHTML = html;
        }
        else if (page === 'entertainmentProductPage') {
            let nameIndex = window.location.href.indexOf("name=");
        
            if (nameIndex > 0) {
                let name = window.location.href.substr(nameIndex + 5);
                let param = {};
                let url = '/productInfo';
                name = name.replace(/%20/g, " ");
                param['name'] = name;
                let res = await getJSON(url, param);
                let json = await res.text();
                let obj = JSON.parse(json);
                let container2 = document.getElementById('container2');
                let html = '';
                let htmlSegment = `<div class="itemCard">
                <h1>${obj.name}</h1>
                <img src="./imgs/movie.jpg" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark">Upvote Number</button>
                <button type="button" class="btn btn-dark">Downvote Number</button>
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                    <h3>Food Description</h3>
                    <span id="productDescription"></span>
                    ${obj.description}
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                                <h3>Other Details</h3>
                        <span id="otherDetails"></span>
                        </div>`;

                html += htmlSegment;

                container2.innerHTML = html;
            }
        }
    }
}

render();