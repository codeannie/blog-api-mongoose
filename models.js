'use strict';

const mongoose = require('mongoose');

//in schema, left side = property; right side is the metadata 
const blogPostSchema = mongoose.Schema ({
  author: {firstName: String, lastName: String}, //author has 2 properties
  title: String, //property: data type
  content: {type: String}, //using 1 config option - meta data about those fields 
  created: {type: Date, default: Date.now}, //property: {define the objects to pass it in}
});

//return author property as one string  (virtual property)
blogPostSchema.virtual('authorName').get(function() {
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

const BlogPosts = mongoose.model('blogPosts', blogPostSchema);
module.exports = BlogPosts; // use this as an object when you are exporting multiple things