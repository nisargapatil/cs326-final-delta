How to setup and build the project:

All the files needed to run the project are included in this repo. We have finished setting up the backend end server and the user interface is able to render the data. 

Once you run server.js, you will be able to send CURL/browser requests to create, update or delete data.
For example, running curl -X POST -H ‘Content-Type: application/json’ -d ‘{ “name”: “Rice”, “description”: “meal”,“category”: “food”}’ localhost:8080/addProduct should add rice to the food page OR
If you use the heroku link to deploy our app, 
running requests such as curl -X POST  e: application/json' -d '{ "name":"travel"}' https://wevote326.herokuapp.com/deleteProduct should delete the product "travel".

You can also access the frontend,where all this data is rendered, deployed on Heroku at https://wevote326.herokuapp.com

After accessing the site, users can view various products on the 3 category pages, different product ratings and details, add upvotes/downvotes, as well as create a poll for a product of their choice. 

