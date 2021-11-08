How to setup and build the project:

All the files needed to run the project are included in this repo. We have finished setting up the backend end server and the user interface is able to render the data. 

Once you run server.js, you will be able to send CURL/browser requests to create, update or delete data.
For example, running curl -X POST -H ‘Content-Type: application/json’ -d ‘{ “name”: “Rice”, “description”: “meal”,“category”: “food”}’ localhost:8080/addProduct should add rice to the food page.

You can also access the frontend,where all this data is rendered, deployed on Heroku at https://wevote326.herokuapp.com

After accessing the site, users can view various products and their ratings, as well as sharing an item on their own. 

