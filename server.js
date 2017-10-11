'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const {BlogPosts} = require('./models');

const app = express();

app.use(morgan('common')); //logs HTTP layer
app.use(bodyParser.json()); //how is this important? 

//GET request for entire DB
app.get('/posts', (req, res) => {
  BlogPosts
    .find()
    .then(posts => {
      res.json({
        posts: posts.map((post) => blogPostData.getAuthor());
      })
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});


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
