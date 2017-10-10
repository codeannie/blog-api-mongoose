'use strict';

const express = require('express');
const morgan = require('morgan');

//create new express app
const app = express();
//export modules in order to use it
const blogPostRouter = require('./blogPostRouter');
//logs http layer
app.use(morgan('common'));

app.use('/blog-posts', blogPostRouter);

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise ((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if(err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
//module refers to server.js 
//if the require.main === server 
if (require.main === module) { 
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer}; //this is main module
