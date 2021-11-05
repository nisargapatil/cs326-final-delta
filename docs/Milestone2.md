Application Structure

1. User Object - ID, Email, Username, Password

2. Product Object - prod_ID, Name, Category, Description, Details, Comments, image_URL, upVotes, downVotes

3. Page Object - page_ID, List (Product Objects)

4. upVote - Is a relationship between 1 Product & 1 User. Each vote has the following fields: object_ID, userID, bool_up

5. downVote - Is a relationship between 1 Product & 1 User. Each vote has the following fields: object_ID, userID, vote_ID, bool_down

For our API, we will need CRUD operations with endpoints for:
1. /product/add which allows for a product to be added to the page when a request is sent to this endpoint containing the  Name, Description, Details, and image_URL of this product.
2. /product/Lookup is a view endpoint which returns all 5 fields for the product as a JSON object
3. /user/signup  which allows for a new user to sign up 
4. /user/login which allows for a user to login
5. /user/id/add/new?vote = upVote which adds an upvote from the user for the given product  provided a prod_ID, and also increments the upvote count. 
6. /user/id/add/new?vote = downVote which adds a downvote from the user for the given product  provided a prod_ID, and also increments the downvote count. 
7. /user/id/addedProducts which allows the user to view a list of products they have added to different categories for rating
8. /user/id/addedProducts/delete?prod_ID which allows the user to remove a product they have added to the ratings page 
9. /Page/id/view which returns all of the products on the given page

Our  file structure to implement:
1. server.js - a server that handles parsing the incoming requests with their URLs and parameters and sends that information to the correct functions. There should be a handler as well as functions for all of the CRUD operations that perform the requisite checks as well as call the required database functions
2. database.js - a file that only implements database logic, should have/wrap functions such as add(), lookup() and findAndUpdate() and handle any errors that may occur
3. pageview.html - a file that renders HTML to view any page
4. productview.html - a file that renders HTML to view any product 
5. productview.js - a client-side JS file which pings the endpoint via fetch for Pageview/product/lookup/ and then uses the returned JSON to inject HTML (via innerHTML) into the productview.html file so that the product details can be viewed
