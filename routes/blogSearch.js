const express = require('express');
const lodash = require('lodash');
const {getBlogsData} = require('./blogData');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      // Retrieve the search query from req.query.query
      
      const query = req.query.query.toLowerCase();
      const blogs = getBlogsData();
  
      // Implementing search functionality using Lodash
      const filteredBlogs = lodash.filter(blogs, (blog) =>
        blog.title.toLowerCase().includes(query)
      );
  console.log(filteredBlogs);
      // Responding to the client with the filtered blogs
      res.json(filteredBlogs);
    } catch (error) {
      
      res.status(500).json({ error: 'An error occurred while searching for blogs.' });
    }
  });
  

module.exports = router;