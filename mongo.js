require('dotenv').config();

const mongoose = require('mongoose');

const DB_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL;

const MODEL = process.env.NODE_ENV === 'test' ? 'testApp' : 'blog';

mongoose.set('strictQuery', false);
mongoose.connect(DB_URL).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
  });

  const Blog = mongoose.model(MODEL, blogSchema);

  Blog.find({}).then((result) => {
    result.forEach((blog) => {
      console.log(blog);
    });
    mongoose.connection.close();
  });
});
