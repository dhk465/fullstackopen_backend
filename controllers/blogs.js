const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// Get the root (frontend page)
blogsRouter.get('/', (response) => {
  response.end('Hello World');
});

// Get all blogs
blogsRouter.get('/api/blogs', (response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

// Get a single blog by id
blogsRouter.get('/api/blogs/:id', (request, response, next) => {
  const id = request.params.id;
  Blog.findById(id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).send({ error: 'blog not found' });
      }
    })
    .catch((error) => next(error));
});

// Add a new blog
blogsRouter.post('/api/blogs', (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = blogsRouter;