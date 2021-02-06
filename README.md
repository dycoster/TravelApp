# Capstone - Travel App

## Overview
This project aims to combine all skills learned in the previous projects to build our own custom travel app. This app allows the user to fill in a travel destination and traveling dates. Upon page load the app will display the current weahter from the users location. Upon submit the app will display a background image of the travel destination and a weather forecast of the destination depending of how far in advance the travel plans are. If the user is traveling within a week the forecast will be of this week starting with their arrival day. If the trip is later the current weatehr will be displayed. 

## Instructions
This will require a understanding of JavaScript, create clean and appealing HTML/CSS, targeting the DOM, working with objects and retrieving data from 3 APIs in which one of those is reliant on another to work. Finally this is all going to be done in a Webpack environment, using an express server and wrapped up with service workers.

### Tools used

* HTML
* SCSS
* Javascript
* Node
* Express
* GeoNames API
* WeatherBit API
* PixaBay API
* Jest
* Workbox

## Installation

### 1 Getting Started

Make sure Node and npm are installed from the terminal.

node -v
npm -v

Fork this repo and clone to begin your project setup and install everything: 

`cd` <project directory>
`npm install`

Install the following loaders and plugins

- npm i -D @babel/core @babel/preset-env babel-loader
- npm i -D style-loader node-sass css-loader sass-loader
- npm i -D clean-webpack-plugin
- npm i -D html-webpack-plugin
- npm i -D mini-css-extract-plugin
- npm i -D optimize-css-assets-webpack-plugin terser-webpack-plugin

### 2 Setting up the API

Sign up for the API-key's at geonames.org  weatherbit.io   pixabay.com

You'll need to configure environment variables using the dotenv package:

Use npm to install the dotenv package - npm install dotenv

Create a new .env file in the root of your project.

Fill the .env file with your weatherbit API key like this:

API_KEY=**************************

### 3 Setup service workers for offline functionality

Require the plugin, by appending the new plugin statement in your webpack.prod.js file.

const WorkboxPlugin = require('workbox-webpack-plugin')

Instantiate the new plugin in the plugin list.

    plugins: [
        new WorkboxPlugin.GenerateSW(),
    ]

use npm to install the plugin:

npm install workbox-webpack-plugin --save-dev

### 4 Run the app
npm run build : builds project

npm start : Run project

The app opens on localhost 3000.

The server listens on port 3030.


## Known issues
There is a compatibility issue with the terser plugin. The plugin needs to be downgrade in the package.json file to

 > "terser-webpack-plugin": "^4.2.3"

 Then run

  - npm i
  - npm run build-prod
