'use strict';

const express = require('express');
const app = express.Router();  //getting router instance & tacking on end points
const mongoose = require('mongoose');

const {BlogPosts} = require('./models');

//GET request for entire DB
app.get('/posts', (req, res) => {
  BlogPosts
    .find()
    .then(posts => {
      res.json({
        posts: posts.map((post) => blogPostData.getAuthor())
      })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went wrong'});
    });
});

//GET request by id
app.get('/posts/:id', (req, res) => {
  BlogPosts
    .findById(req.params.id)
    .then(post => res.json(post.showAuthor()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Get request by id did not work'});
    });
});

//POST request
app.post('/posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
      if(!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
      }
  }
  BlogPosts
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(200).json(blogPost.showAuthor()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});

//PUT request by id 
app.put('/posts/:id', (req, res) => {
  //handle error if id's don't match
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: `Request path id (${req.params.id}) and request body id ({${req.bod.id}) must match`
    });
  }

  const updated = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  BlogPosts
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'something went wrong'}));
});

//DELETE 
app.delete('/posts/:id', (req, res) => {
  BlogPosts
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'post deleted'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'internal server error'});
    });
});

module.exports = app;  //need to be an actual declared variable 