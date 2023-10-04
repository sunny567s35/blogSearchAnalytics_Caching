const express = require('express');
const axios = require('axios');
const lodash = require('lodash');
const {setBlogsData} = require('./blogData');
const router = express.Router();

// Function to fetch and analyze blog data
const fetchAndAnalyzeBlogs = async () => {
  try {
    // Making a GET request to the third-party blog API using Axios
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    // Performing analytics using Lodash
    const blogs = response.data.blogs; 
    setBlogsData(blogs);
    const totalBlogs = blogs.length;
    const longestBlog = lodash.maxBy(blogs, (blog) => blog.title.length);
    const blogsWithPrivacy = lodash.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes('privacy')
    );
    const uniqueBlogTitles = lodash.uniqBy(blogs, 'title');

    // Create a JSON object with the statistics
    const stats = {
      totalBlogs,
      longestBlog,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles,
    };

    return stats;
  } catch (error) {
    throw new Error('An error occurred while fetching and analyzing blog data.');
  }
};

// Memoize the fetchAndAnalyzeBlogs function with a caching period of 1 hour (in milliseconds)
const memoizedFetchAndAnalyzeBlogs = lodash.memoize(fetchAndAnalyzeBlogs, (query) => query, 3600000);

// Middleware for /api/blog-stats with caching
router.get('/', async (req, res) => {
  try {
    // Get the cached or freshly fetched statistics
    const query = req.query.query || 'default'; // Use a default query for caching
    const stats = await memoizedFetchAndAnalyzeBlogs(query);

    // Respond to the client with the JSON object
    res.json(stats);
  } catch (error) {
    // Handle errors gracefully and respond with an error message
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
