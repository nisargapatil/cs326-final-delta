
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

async function upVote(name) {
    let param = {};
    let url = '/upvote';
    param['name'] = name;
    name = name.replace(/%20/g, " ");
    let res = await getJSON(url, param);
    let json = await res.text();
    let obj = JSON.parse(json);
    document.getElementById(name + "_upButton").innerHTML = 'Upvote (' + obj.upVote + ')';
}

async function downVote(name) {
    let param = {};
    let url = '/downvote';
    param['name'] = name;
    name = name.replace(/%20/g, " ");
    let res = await getJSON(url, param);
    let json = await res.text();
    let obj = JSON.parse(json);
    document.getElementById(name + "_downButton").innerHTML = 'Downvote (' + obj.downVote + ')';
}

async function addFoodProduct() {
    let url = '/addProduct';
    let name = document.getElementById('product_name');
    let desc = document.getElementById('product_desc');
    let detail = document.getElementById('product_detail');

    if (name !== undefined && name.value.length > 0 &&
        desc !== undefined && desc.value.length > 0 &&
        detail !== undefined && detail.value.length > 0) {
        let param = {};
        param['name'] = name.value;
        param['category'] = 'food';
        param['description'] = desc.value;
        param['details'] = detail.value;
        let res = await getJSON(url, param);
        let json = await res.text();
        let obj = JSON.parse(json);
       if (obj !== undefined && obj.name !== undefined) {
           alert("Food " + obj.name + " added sucessfully.")
       }
    }
    else {
        alert('Invalid input');
    }
}

async function addTravelProduct() {
    let url = '/addProduct';
    let name = document.getElementById('product_name');
    let desc = document.getElementById('product_desc');
    let detail = document.getElementById('product_detail');

    if (name !== undefined && name.value.length > 0 &&
        desc !== undefined && desc.value.length > 0 &&
        detail !== undefined && detail.value.length > 0) {
        let param = {};
        param['name'] = name.value;
        param['category'] = 'Travel';
        param['description'] = desc.value;
        param['details'] = detail.value;
        let res = await getJSON(url, param);
        let json = await res.text();
        let obj = JSON.parse(json);
       if (obj !== undefined && obj.name !== undefined) {
           alert("Travel " + obj.name + " added sucessfully.")
       }
    }
    else {
        alert('Invalid input');
    }
}

async function addEntertainmentProduct() {
    let url = '/addProduct';
    let name = document.getElementById('product_name');
    let desc = document.getElementById('product_desc');
    let detail = document.getElementById('product_detail');

    if (name !== undefined && name.value.length > 0 &&
        desc !== undefined && desc.value.length > 0 &&
        detail !== undefined && detail.value.length > 0) {
        let param = {};
        param['name'] = name.value;
        param['category'] = 'Entertainment';
        param['description'] = desc.value;
        param['details'] = detail.value;
        let res = await getJSON(url, param);
        let json = await res.text();
        let obj = JSON.parse(json);
       if (obj !== undefined && obj.name !== undefined) {
           alert("Entertainment " + obj.name + " added sucessfully.")
       }
    }
    else {
        alert('Invalid input');
    }
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
                <button type="button" class="btn btn-dark" id="${obj[i].name}_upButton">Upvote (${obj[i].upVote})</button>
                <button type="button" class="btn btn-dark" id="${obj[i].name}_downButton">Downvote (${obj[i].downVote})</button>
                <a href="viewPage?page=foodProductPage&name=${obj[i].name}">
                    <button type="button" button type="submit" class="btn btn-dark" href="#">View</button>
                </a>
                </div>`;
                html += htmlSegment;
            }
            container2.innerHTML = html;
            for (let i=0; i < obj.length; i++) {
                document.getElementById(obj[i].name + "_upButton").addEventListener('click', function() {upVote(obj[i].name)});
                document.getElementById(obj[i].name + "_downButton").addEventListener('click', function() {downVote(obj[i].name)});
            }
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
                <button type="button" class="btn btn-dark" id="${obj.name}_upButton">Upvote (${obj.upVote})</button>
                <button type="button" class="btn btn-dark" id="${obj.name}_downButton">Downvote (${obj.downVote})</button>
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
                <button type="button" class="btn btn-dark" id="${obj[i].name}_upButton">Upvote (${obj[i].upVote})</button>
                <button type="button" class="btn btn-dark" id="${obj[i].name}_downButton">Downvote (${obj[i].downVote})</button>
                <a href="viewPage?page=travelProductPage&name=${obj[i].name}">
                    <button type="button" button type="submit" class="btn btn-dark" href="#">View</button>
                </a>
                </div>`;
                html += htmlSegment;
            }
            container2.innerHTML = html;
            for (let i=0; i < obj.length; i++) {
                document.getElementById(obj[i].name + "_upButton").addEventListener('click', function() {upVote(obj[i].name)});
                document.getElementById(obj[i].name + "_downButton").addEventListener('click', function() {downVote(obj[i].name)});
            }
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
                <button type="button" class="btn btn-dark" id="${obj.name}_upButton">Upvote (${obj.upVote})</button>
                <button type="button" class="btn btn-dark" id="${obj.name}_downButton">Downvote (${obj.downVote})</button>
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
                <button type="button" class="btn btn-dark" id="${obj[i].name}_upButton">Upvote (${obj[i].upVote})</button>
                <button type="button" class="btn btn-dark" id="${obj[i].name}_downButton">Downvote (${obj[i].downVote})</button>
                <a href="viewPage?page=entertainmentProductPage&name=${obj[i].name}">
                    <button type="button" button type="submit" class="btn btn-dark" href="#">View</button>
                </a>
                </div>`;
                html += htmlSegment;
            }
            container2.innerHTML = html;
            for (let i=0; i < obj.length; i++) {
                document.getElementById(obj[i].name + "_upButton").addEventListener('click', function() {upVote(obj[i].name)});
                document.getElementById(obj[i].name + "_downButton").addEventListener('click', function() {downVote(obj[i].name)});
            }
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
                <button type="button" class="btn btn-dark" id="${obj.name}_upButton">Upvote (${obj.upVote})</button>
                <button type="button" class="btn btn-dark" id="${obj.name}_downButton">Downvote (${obj.downVote})</button>
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
        else if (page === 'foodCreatePoll') {
            let url = '/addProduct';

            let html = `<h1>Add New Food</h1>
            <form>
                <br>
                <label>Upload a picture</label>
                <input type="file" id="img" name="img" accept="image/*">
                <br>
                <input type="text" class="input-field" placeholder="Name" id="product_name">
                <input type="text" class="input-field" placeholder="Description" id="product_desc">
                <input type="text" class="input-field" placeholder="Other Details" id="product_detail">
                <br>
                <button type="button" class="btn" id="addFood_button">Create Poll</button>
            </form>`;
            let container = document.getElementById('container');
            container.innerHTML = html;
            document.getElementById("addFood_button").addEventListener('click', function() {addFoodProduct()});
        }
        else if (page === 'travelCreatePoll') {
            let url = '/addProduct';

            let html = `<h1>Add New Travel</h1>
            <form>
                <br>
                <label>Upload a picture</label>
                <input type="file" id="img" name="img" accept="image/*">
                <br>
                <input type="text" class="input-field" placeholder="Name" id="product_name">
                <input type="text" class="input-field" placeholder="Description" id="product_desc">
                <input type="text" class="input-field" placeholder="Other Details" id="product_detail">
                <br>
                <button type="button" class="btn" id="addTravel_button">Create Poll</button>
            </form>`;
            let container = document.getElementById('container');
            container.innerHTML = html;
            document.getElementById("addTravel_button").addEventListener('click', function() {addTravelProduct()});
        }
        else if (page === 'entertainmentCreatePoll') {
            let url = '/addProduct';

            let html = `<h1>Add New Entertainment</h1>
            <form>
                <br>
                <label>Upload a picture</label>
                <input type="file" id="img" name="img" accept="image/*">
                <br>
                <input type="text" class="input-field" placeholder="Name" id="product_name">
                <input type="text" class="input-field" placeholder="Description" id="product_desc">
                <input type="text" class="input-field" placeholder="Other Details" id="product_detail">
                <br>
                <button type="button" class="btn" id="addEntertainment_button">Create Poll</button>
            </form>`;
            let container = document.getElementById('container');
            container.innerHTML = html;
            document.getElementById("addEntertainment_button").addEventListener('click', function() {addEntertainmentProduct()});
        }
    }
}

render();