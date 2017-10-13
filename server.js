'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const blogPostRouter = require('./blogPostRouter');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const {BlogPosts} = require('./models');

const app = express();

app.use(morgan('common')); //logs HTTP layer
app.use(bodyParser.json()); //look this up with Google sensei 
app.use('/blog-post', blogPostRouter);

//what is this for? 
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl = DATABASE_URL, port=PORT) {
  return new Promise ((resolve, reject) => {
    //using mongoose to connect to database
    mongoose.connect(databaseUrl, err => {
      if(err) {
        return reject(err);
      }
      //telling express to listen for request in port 
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
    return new Promise ((resolve, reject) => {
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
}

module.exports = {app, runServer, closeServer}; 
