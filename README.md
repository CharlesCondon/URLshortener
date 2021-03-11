# URLshortener

## What It Does
This program generates a website that has 3 main pages: a trending urls page, a url shortener page, and a url expand page.

### Trending Page
The home page of the program displays the top 5 shortened/expanded urls used on the site. The program starts with 5 urls from [urldata.json](./data/urldata.json)
and edits the file each time an action is made on the site. This JSON file acts as a simplified database as a way to practice async callbacks.

### URL Shorten Page
This page allows the user to input any valid url and returns a shortened url using POST HTTPS requests based on a short string of random alphanumeric characters. 
The program then checks if the url given is already in the "database" and if so, returns the shortened url that is already stored and increases the ranking of 
that url. If the given url is not already saved, then the program generates a new shortened url to return to the user and places both the long url and 
corresponding short url in the "database" for later reference.

### URL Expand Page
This page allows the user to enter in a shortened url and returns the corresponding expanded url using a GET HTTPS request from the "database" if it is present.

## What Is Being Used
This program was made using JavaScript with Node.js for compilation, Express.js for routing, middleware, and request/response handling, and HBS for the website's
design templating.
