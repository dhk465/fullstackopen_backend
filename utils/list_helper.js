const _ = require('lodash');

const dummy = (blogs) => {
  if (blogs) {
    return 1;
  }
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const mostLiked = blogs.reduce((maxBlog, currentBlog) => {
    if (currentBlog.likes === undefined) return maxBlog;
    if (maxBlog.likes === undefined) return currentBlog;
    return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog;
  }, blogs[0]);
  return mostLiked;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const grouped = _.groupBy(blogs, 'author');
  const mostFrequentValue = _.maxBy(
    Object.keys(grouped),
    (key) => grouped[key].length
  );
  return {
    author: mostFrequentValue,
    blogs: grouped[mostFrequentValue].length,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const grouped = _.groupBy(blogs, 'author');
  const result = _.maxBy(Object.entries(grouped), ([category, group]) =>
    _.sumBy(group, 'likes')
  );
  return {
    author: result[0],
    likes: _.sumBy(result[1], 'likes'),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
