'use strict';

const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema ({
  author: {firstName: String, lastName: String},
  title: String,
  content: {type: String}, //what's the difference in syntax for title vs content? 
  created: {type: Date, default: Date.now},
});

//return author proprety as one string  (virtual property)
blogPostSchema.virtual('author').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.showAuthor = function() {
  return {
    id: this._id, 
    author: this.author,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const BlogPosts = mongoose.model(blogPosts, blogPostSchema);
module.exports = {BlogPosts}; //?