'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const {blogPosts} = require('./models');

const app = express();

//logs http layer
app.use(morgan('common'));
app.use(bodyParser.json()); //how is this important? 

let server;

function runServer(databaseUrl = DATABASE_URL, port=PORT) {
  return new Promise ((resolve, reject) => {
    mongoose.connect(databaseURL, err => {
      if(err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error',err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise ((resolve, reject => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
      resolve();
      });
    });
  });
}

//module refers to server.js 
//if the require.main === server 
if (require.main === module) { 
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer}; 
