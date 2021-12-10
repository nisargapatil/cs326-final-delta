let img_uploaded = "";
let img_file = "";
let login_user = "";

function isLogin() {
    let isLogin = false;
    let myStorage = window.localStorage;
    if (myStorage !== undefined) {
        let user = myStorage.getItem('user');
        if (user !== undefined && user !== null) {
            isLogin = true;
        }
    }
    return isLogin;
}

function loginUser() {
    let user = "";
    let myStorage = window.localStorage;
    if (myStorage !== undefined) {
        user = myStorage.getItem('user');
    }
    return user;
}

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
    document.getElementById(name + "_upButton").innerHTML = 'Upvote (' + obj.upvote + ')';
}

async function downVote(name) {
    let param = {};
    let url = '/downvote';
    param['name'] = name;
    name = name.replace(/%20/g, " ");
    let res = await getJSON(url, param);
    let json = await res.text();
    let obj = JSON.parse(json);
    document.getElementById(name + "_downButton").innerHTML = 'Downvote (' + obj.downvote + ')';
}

async function createUser() {
    let url = '/createUser';
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirm_password = document.getElementById('confirm_password');

    if (username !== undefined && username.value.length > 0 &&
        email !== undefined && email.value.length > 0 &&
        password !== undefined && password.value.length > 0 &&
        confirm_password !== undefined && confirm_password.value.length > 0) {
        if (password.value !== confirm_password.value) {
            alert('Password does not match!');
        }
        else {
            let param = {};
            param['name'] = username.value;
            param['email'] = email.value;
            param['password'] = password.value;
            let res = await getJSON(url, param);
            let json = await res.text();
            console.log(json);
            let obj = JSON.parse(json);
            if (obj !== undefined && obj['username'] !== undefined) {
               let myStorage = window.localStorage;
               if (myStorage !== undefined) {
                   myStorage.setItem('user', obj['username']);
               }
               alert("User " + obj['username'] + " added sucessfully.")
               window.location.replace("/viewPage?page=home");
           }
            else {
                alert("Error adding user " + username.value);
            }
        }
    }
    else {
        alert('Invalid input');
    }
}

async function login() {
    let url = '/login';
    let username = document.getElementById('username');
    let password = document.getElementById('password');

    if (username !== undefined && username.value.length > 0 &&
        password !== undefined && password.value.length > 0) {
        let param = {};
        param['username'] = username.value;
        param['password'] = password.value;
        let res = await getJSON(url, param);
        let json = await res.text();
        if (json !== undefined) {
            let obj = JSON.parse(json);
            if (obj !== undefined && obj.username !== undefined) {
                login_user = obj.username;
                let myStorage = window.localStorage;
                if (myStorage !== undefined) {
                    myStorage.setItem('user', obj.username);
                }
                alert("User " + obj.username + " logged in sucessfully.")
                window.location.replace("/viewPage?page=home");
            }
            else {
                alert("Error logging in as user " + username.value);
            }
        }
        else {
            alert("Error logging in as user " + username.value);
        }
    }
    else {
        alert('Invalid input, username and password cannot be empty');
    }
}

async function addFoodProduct() {
    let url = '/addProduct';
    let name = document.getElementById('product_name');
    let desc = document.getElementById('product_desc');

    if (name !== undefined && name.value.length > 0 &&
        desc !== undefined && desc.value.length > 0 ) {
        let param = {};
        param['name'] = name.value;
        param['category'] = 'Food';
        param['description'] = desc.value;

        if (img_uploaded != null && img_uploaded.length > 0) {
            param['image'] = img_uploaded;
            param['image_file'] = img_file;
        }
        let res = await getJSON(url, param);
        let json = await res.text();
        let obj = JSON.parse(json);
       if (obj !== undefined && obj.name !== undefined) {
           alert("Food " + obj.name + " added sucessfully.")
           window.location.replace("/viewPage?page=foodRatePage");
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

    if (name !== undefined && name.value.length > 0 &&
        desc !== undefined && desc.value.length > 0 ) {
        let param = {};
        param['name'] = name.value;
        param['category'] = 'Travel';
        param['description'] = desc.value;

        if (img_uploaded != null && img_uploaded.length > 0) {
            param['image'] = img_uploaded;
            param['image_file'] = img_file;
        }
        let res = await getJSON(url, param);
        let json = await res.text();
        let obj = JSON.parse(json);
       if (obj !== undefined && obj.name !== undefined) {
           alert("Travel " + obj.name + " added sucessfully.")
           window.location.replace("/viewPage?page=travelRatePage");
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

    if (name !== undefined && name.value.length > 0 &&
        desc !== undefined && desc.value.length > 0 ) {
        let param = {};
        param['name'] = name.value;
        param['category'] = 'Entertainment';
        param['description'] = desc.value;

        if (img_uploaded != null && img_uploaded.length > 0) {
            param['image'] = img_uploaded;
            param['image_file'] = img_file;
        }
        let res = await getJSON(url, param);
        let json = await res.text();
        let obj = JSON.parse(json);
       if (obj !== undefined && obj.name !== undefined) {
           alert("Entertainment " + obj.name + " added sucessfully.")
           window.location.replace("/viewPage?page=entertainmentRatePage");
       }
    }
    else {
        alert('Invalid input');
    }
}

function process_home_page() {
    let url = '/home';
    let user_login = isLogin();

    let html;
    if (isLogin() === false) {
        let create_btn = document.getElementById('create_id');
        html = `<a href="viewPage?page=createAccount">
        <button type="submit" class="btn btn-dark">Create Account</button>
        </a>`;
        create_btn.innerHTML = html;

        let login_btn = document.getElementById('login_id');
        html = `<a href="viewPage?page=login">
        <button type="submit" class="btn btn-dark">Log In</button>
        </a>`;
        login_btn.innerHTML = html;
    }
    else {
        let login_btn = document.getElementById('login_id');
        let user = loginUser();
        html = `<a href="javascript:logout()">
        <button type="submit" class="btn btn-dark">${user} - logout</button>
        </a>`;
        login_btn.innerHTML = html;
    }
}

function logout() {
    let myStorage = window.localStorage;
    if (myStorage !== undefined) {
        console.log("Logout remove user");
        myStorage.removeItem('user');
    }
    window.location.replace("/viewPage?page=home");
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
            let res = await getJSON(url, {category: 'Food'});
            let json = await res.text();
            let obj = JSON.parse(json);
            let container2 = document.getElementById('container2');
            let html = '';
            for (let i of obj) {
                let image = i.image;
                if (image === undefined || image === null  || image.length === 0) {
                    image = "./imgs/foodPic.jpg";
                }
                let htmlSegment = `<div class="itemCard">
                <h1>${i.name}</h1>
                <img src="${image}" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark" id="${i.name}_upButton">Upvote (${i.upvote})</button>
                <button type="button" class="btn btn-dark" id="${i.name}_downButton">Downvote (${i.downvote})</button>
                <a href="viewPage?page=foodProductPage&name=${i.name}">
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
                let image = obj.image;
                if (image === undefined || image === null  || image.length === 0) {
                    image = "./imgs/foodPic.jpg";
                }
                let htmlSegment = `<div class="itemCard">
                <h1>${obj.name}</h1>
                <img src="${image}" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark" id="${obj.name}_upButton">Upvote (${obj.upvote})</button>
                <button type="button" class="btn btn-dark" id="${obj.name}_downButton">Downvote (${obj.downvote})</button>
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                    <h3>Food Description</h3>
                    <span id="productDescription"></span>
                    ${obj.description}
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
            for (let i of obj) {
                let image = i.image;
                if (image === undefined || image === null  || image.length === 0) {
                    image = "./imgs/travelPic.jpg";
                }
                let htmlSegment = `<div class="itemCard">
                <h1>${i.name}</h1>
                <img src="${image}" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark" id="${i.name}_upButton">Upvote (${i.upvote})</button>
                <button type="button" class="btn btn-dark" id="${i.name}_downButton">Downvote (${i.downvote})</button>
                <a href="viewPage?page=travelProductPage&name=${i.name}">
                    <button type="button" button type="submit" class="btn btn-dark" href="#">View</button>
                </a>
                </div>`;
                html += htmlSegment;
            }
            container2.innerHTML = html;
            for (let i of obj) {
                document.getElementById(i.name + "_upButton").addEventListener('click', function() {upVote(i.name)});
                document.getElementById(i.name + "_downButton").addEventListener('click', function() {downVote(i.name)});
            }
        }
        else if (page === 'travelProductPage') {
            let nameIndex = window.location.href.indexOf("name=");
        
            if (nameIndex > 0) {
                let name = window.location.href.substr(nameIndex + 5);
                console.log(name);
                let param = {};
                let url = '/productInfo';
                param['name'] = name;
                name = name.replace(/%20/g, " ");
                let res = await getJSON(url, param);
                let json = await res.text();
                let obj = JSON.parse(json);
                console.log(obj);
                let image = obj.image;
                if (image === undefined || image === null  || image.length === 0) {
                    image = "./imgs/travelPic.jpg";
                }
                let container2 = document.getElementById('container2');
                let html = '';
                let htmlSegment = `<div class="itemCard">
                <h1>${obj.name}</h1>
                <img src="${image}" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark" id="${obj.name}_upButton">Upvote (${obj.upvote})</button>
                <button type="button" class="btn btn-dark" id="${obj.name}_downButton">Downvote (${obj.downvote})</button>
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                    <h3>Description</h3>
                    <span id="productDescription"></span>
                    ${obj.description}
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
                let image = obj[i].image;
                if (image === undefined || image === null || image.length === 0) {
                    image = "./imgs/movie.jpg";
                }
                let htmlSegment = `<div class="itemCard">
                <h1>${obj[i].name}</h1>
                <img src="${image}" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark" id="${obj[i].name}_upButton">Upvote (${obj[i].upvote})</button>
                <button type="button" class="btn btn-dark" id="${obj[i].name}_downButton">Downvote (${obj[i].downvote})</button>
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
                let image = obj.image;
                if (image === undefined || image === null  || image.length === 0) {
                    image = "./imgs/movie.jpg";
                }
                let container2 = document.getElementById('container2');
                let html = '';
                let htmlSegment = `<div class="itemCard">
                <h1>${obj.name}</h1>
                <img src="${image}" width="200" height="200"><br><br>
                <button type="button" class="btn btn-dark" id="${obj.name}_upButton">Upvote (${obj.upvote})</button>
                <button type="button" class="btn btn-dark" id="${obj.name}_downButton">Downvote (${obj.downvote})</button>
                </div>`;

                html += htmlSegment;

                htmlSegment = `<div class="itemCard">
                    <h3>Description</h3>
                    <span id="productDescription"></span>
                    ${obj.description}
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
                <input type="file" id="food_img" name="food_img" accept="image/*">
                <br>
                <input type="text" class="input-field" placeholder="Name" id="product_name">
                <input type="text" class="input-field" placeholder="Description" id="product_desc">
                <br>
                <button type="button" class="btn" id="addFood_button">Create Poll</button>
            </form>`;

            let container = document.getElementById('container');
            container.innerHTML = html;
            document.getElementById("addFood_button").addEventListener('click', function() {addFoodProduct()});
            let food_img = document.querySelector("#food_img");
            img_uploaded = "";
            img_file = "";
            food_img.addEventListener("change", function(){
                let reader = new FileReader();
                reader.addEventListener("load", ()=> {
                    img_uploaded = reader.result;
                })
                reader.readAsDataURL(this.files[0]);
                img_file = this.files[0].name;
            });
        }
        else if (page === 'travelCreatePoll') {
            let url = '/addProduct';

            let html = `<h1>Add New Travel</h1>
            <form>
                <br>
                <label>Upload a picture</label>
                <input type="file" id="travel_img" name="travel_img" accept="image/*">
                <br>
                <input type="text" class="input-field" placeholder="Name" id="product_name">
                <input type="text" class="input-field" placeholder="Description" id="product_desc">
                <br>
                <button type="button" class="btn" id="addTravel_button">Create Poll</button>
            </form>`;
            let container = document.getElementById('container');
            container.innerHTML = html;
            document.getElementById("addTravel_button").addEventListener('click', function() {addTravelProduct()});
            let travel_img = document.querySelector("#travel_img");
            img_uploaded = "";
            img_file = "";
            travel_img.addEventListener("change", function(){
                let reader = new FileReader();
                reader.addEventListener("load", ()=> {
                    img_uploaded = reader.result;
                })
                reader.readAsDataURL(this.files[0]);
                img_file = this.files[0].name;
            });
        }
        else if (page === 'entertainmentCreatePoll') {
            let url = '/addProduct';

            let html = `<h1>Add New Entertainment</h1>
            <form>
                <br>
                <label>Upload a picture</label>
                <input type="file" id="entertainment_img" name="entertainment_img" accept="image/*">
                <br>
                <input type="text" class="input-field" placeholder="Name" id="product_name">
                <input type="text" class="input-field" placeholder="Description" id="product_desc">
                <br>
                <button type="button" class="btn" id="addEntertainment_button">Create Poll</button>
            </form>`;
            let container = document.getElementById('container');
            container.innerHTML = html;
            document.getElementById("addEntertainment_button").addEventListener('click', function() {addEntertainmentProduct()});
            let entertainment_img = document.querySelector("#entertainment_img");
            img_uploaded = "";
            img_file = "";
            entertainment_img.addEventListener("change", function(){
                let reader = new FileReader();
                reader.addEventListener("load", ()=> {
                    img_uploaded = reader.result;
                })
                reader.readAsDataURL(this.files[0]);
                img_file = this.files[0].name;
            });
        }
        else if (page === 'createAccount') {
            let url = '/createUser';

            let html = `    <div class="itemCardx">
            <h5>CREATE YOUR ACCOUNT</h5><br>
            Email <br> <input type="text" id="email" /><br /><br>
            Username <br> <input type="text" id="username" /><br /><br>
            Password <br> <input type="password" id="password" /><br /><br>
            Confirm Password <br> <input type="password" id="confirm_password" /><br />
            <button type="button" class="btn btn-dark" id="createUser_button">Create Your Account</button><br>
            </div>
        `;
            let container = document.getElementById('log-container');
            container.innerHTML = html;
            document.getElementById("createUser_button").addEventListener('click', function() {createUser()});
        }
        else if (page === 'login') {
            let url = '/login';

            let html = `    <div class="itemCardx">
            <h5>LOG INTO EXISTING ACCOUNT</h5><br>   
            Username <br> <input type="text" id="username" /><br /><br>
            Password <br> <input type="password" id="password" /><br /><br>
            <button type="button" class="btn btn-dark" id="login_button">Login</button>
            </div>`;
            let container = document.getElementById('log-container');
            container.innerHTML = html;
            document.getElementById("login_button").addEventListener('click', function() {login()});
        }        
        else if (page === 'home') {
            process_home_page();
        }        
    }
    else {
        process_home_page();
    }
}
render();