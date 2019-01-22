# Music recommender visualizations
## Introduction
This web app is used test different levels of user control of music recommender system built by web spotify API. The web app was implemented by express.js and jQuery.

## Folder content

### /bower_components
all dependent libraries and some pre-installed libraried in express

### /model
configuration mongoose for mongo DB

### /node_modules
installed libraies by npm

### /music-vis/public/js/
this folder contains two main js files for the front-end page

#### data-vis.js
this js file is for controlling recommender UI and data communication with server

#### welcome.js
this file is for welcome page for evaluation

### music-vis/public/stylesheets/
this folder contains two css files

#### style.css
this js file is for recommender UI style

#### welcome.css
this file is for welcome page for evaluation

### music-vis/routes/
this is for back-end using a spotify-api wrapper

#### index.js
a router for system, a restulful API to call the services in recommender.js

#### recommender.js
recommender engine using the spotify-api wrapper

### /music-vis
different pages powered by jade template

### app.js
this is a script to start the app

## How to deploy the app

### Step 1
Make sure you have installed node and mongodb on you PC.

### Step 2
replace the appKey and appSecret with yours generated from web spotify API page; and set your own callbackURL in index.js and recommender.js

### Step 3
Start the app
start mongodb in terminal by "mongod"
start the app in terminal by tpying "node app.js"
