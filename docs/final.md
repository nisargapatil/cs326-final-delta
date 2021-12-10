# Team Delta

## WeVote App

### Fall 2021

Our application is deployed on heroku on this link: https://wevote326.herokuapp.com

We have implemented a web application where people can add and read product reviews in different categories. These reviews will be in the form of upvotes and downvotes on items in each category. Some of the categories that we have integrated into the application are: Entertainment, Food, and Travel. This application will be similar to some shopping websites in a way that the users have the ability to click on the item that they are interested in, and be directed to a different page where they can see more details about the particular item. These details will include the description of the item, and the number of upvotes/downvotes it gets. 

Our app is using the key concept from social media platforms such as Facebook and Instagram, where users are able to like/dislike each other’s posts and the person who’s posting can see the feedback they are receiving from other users. Since this is a familiar concept that many people do on a daily basis, the voting application will be very straightforward and intuitive to use.

WeVote App will be helpful for the users who are looking for new places to travel, want to explore different food options, need TV show/movie recommendations, and so on. They can look at the upvotes and downvotes for all the items in different categories when they are trying to choose their best option. They can also upload any item of their choice into one of the categories so they can seek other users' opinions about that item in terms of upvotes and downvotes.

## Team Members

1. Nisarga Patil (@nisargapatil)
2. Elizabeth Seto (@elizabethseto)
3. Yiming Zhao (@yimingzhao14)


## User Interface

Our UI has fpur main compoments: Home Page, Rating Pages, Product Pages, Create Poll Page

### Home Page

This is how the home page looks when you first go to the heroku link. You can see the Food, Travel, and Entertainment categories to choose from, as well as create account and log in buttons at the top.

![Home Page](Final_Screenshots/HomePage.png)

If you try to select a category before creating your account or logging into your existing one, you will get this alert.

![Alert](Final_Screenshots/HomePageAlert.png)

When the user selects create account, they will be redirected to this form to fill out their details and create an account.

![Create](Final_Screenshots/CreateAccount.png)

If the user wants to log in instead, they will be redirected to this form to enter their username and password.

![Log In](Final_Screenshots/Login.png)


### Rating Pages

Once the user is logged in and selects a category, they will be able to view all the products and corresponding ratings on that page.

Depending on the chosen category, these are the pages you will be redirected to:

1. Food

![Food](Final_Screenshots/FoodRating.png)

2. Entertainment

![Entertainment](Final_Screenshots/EntertainmentRating.png)

3. Travel 

![Travel](Final_Screenshots/TravelRating.png)

### Product Pages

When you click on 'view' on one of the featured products, it takes you to the product details page which displays the upvotes and downvotes on the product, and its description added by the user. 

For example, if you wanted to view more details about 'Stranger Things' on the 'Entertainment' page, this is what you will find : 

![Details](Final_Screenshots/ViewProduct.png)

### Create Poll Page

If you click on 'Add Item' on the ratings page, you will be able to create your own rating poll for whichever product you use. You simply have to enter the information in this form, and the product will be added to that catgeory.

![Poll](Final_Screenshots/FoodPoll.png)


APIs: A final up-to-date list/table describing your application’s API // TODO by @elizabethseto

## Database

Here's the description of our database:

        Data types in the tables: 

        Products (id varchar(50), name text, category(text), description(text), image(text), upvote(integer), downvote(integer));

        Users (name text, password varchar(50), email text, id varchar(50));

        Products table contains the product id, name, its category(either food,travel, or entertainment), description, file path for the image and the no. of upvotes/downvotes it gets.
    
        Users table contains the name, password, email, and user id of all the users who log into our application.
        
        Example tables:

        Products:

                         id                  | name  | category | description |       image         | upvote  | downvote 
        -------------------------------------+-------+----------+-------------+---------------------+---------+----------
        0dae2f90-f25b-4a2b-b261-03057292938a | Paris | Travel   | a place     |  imgs/Paris.jpg     |     8   |    11

       

        Users:

          name   | password |       email       |                 id                  
        ---------+----------+-------------------+-------------------------------------
         Nisarga | cs326    | nisarga@gmail.com | rwe2f90-f25b-4a2b-b261-03057292938b


URL Routes/Mappings: A final up-to-date table of all the URL routes that your application supports and a short description of what those routes are used for. You should also indicate any authentication and permissions on those routes.  // TODO by @elizabethseto

Authentication/Authorization: A final up-to-date description of how users are authenticated and any permissions for specific users (if any) that you used in your application. You should mention how they relate to which UI views are accessible.  // TODO by @elizabethseto

## Division of Labor

1. Nisarga: Designed the wireframes for the app, Worked on the frontend pages HTML/CSS, Wrote the content for markdown files, Deployed the app and set up the database on Heroku, Worked on the backend for DBMS

2. Elizabeth:

3. Yiming: 


Conclusion: A conclusion describing your team’s experience in working on this project. This should include what you learned through the design and implementation process, the difficulties you encountered, what your team would have liked to know before starting the project that would have helped you later, and any other technical hurdles that your team encountered. // TODO by @elizabethseto

