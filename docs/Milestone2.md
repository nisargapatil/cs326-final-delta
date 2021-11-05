Application Structure

User Object - ID, Email, Username, Password
Product Object - prod_ID, Name, Category, Description, Details, Comments, image_URL, upVotes, downVotes
Page Object - page_ID, List (Product Objects)
upVote - Is a relationship between 1 Product & 1 User. Each vote has the following fields: object_ID, userID, bool_up
downVote - Is a relationship between 1 Product & 1 User. Each vote has the following fields: object_ID, userID, vote_ID, bool_down

For our API, we will need CRUD operations with endpoints for:
/product/add which allows for a product to be added to the page when a request is sent to this endpoint containing the  Name, Description, Details, and image_URL of this product.
/product/Lookup is a view endpoint which returns all 5 fields for the product as a JSON object
/user/signup  which allows for a new user to sign up 
/login which allows for a user to login
/user/id/add/new?vote = upVote which adds an upvote from the user for the given product  provided a prod_ID, and also increments the upvote count. 
/user/id/add/new?vote = downVote which adds a downvote from the user for the given product  provided a prod_ID, and also increments the downvote count. 
/user/id/addedProducts which allows the user to view a list of products they have added to different categories for rating
/user/id/addedProducts/delete?prod_ID which allows the user to remove a product they have added to the ratings page 
/Page/id/view which returns all of the products on the given page

Our  file structure to implement:
server.js - a server that handles parsing the incoming requests with their URLs and parameters and sends that information to the correct functions. There should be a handler as well as functions for all of the CRUD operations that perform the requisite checks as well as call the required database functions
database.js - a file that only implements database logic, should have/wrap functions such as add(), lookup() and findAndUpdate() and handle any errors that may occur
pageview.html - a file that renders HTML to view any page
productview.html - a file that renders HTML to view any product 
productview.js - a client-side JS file which pings the endpoint via fetch for Pageview/product/lookup/ and then uses the returned JSON to inject HTML (via innerHTML) into the productview.html file so that the product details can be viewed
