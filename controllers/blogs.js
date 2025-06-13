const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization');
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '');
//   }
//   return null;
// };

// Get all blogs
// blogsRouter.get('/', (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

// Get a single blog by id
// blogsRouter.get('/:id', (request, response, next) => {
//   const id = request.params.id;
//   Blog.findById(id)
//     .then((blog) => {
//       if (blog) {
//         response.json(blog);
//       } else {
//         response.status(404).send({ error: 'blog not found' });
//       }
//     })
//     .catch((error) => next(error));
// });

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).send({ error: 'blog not found' });
  }
});

blogsRouter.post('/', async (request, response) => {
  const user = await User.findById(request.user.id);
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' });
  }
  const blog = new Blog({ ...request.body, user: user._id });
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }
  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'unauthorized' });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
