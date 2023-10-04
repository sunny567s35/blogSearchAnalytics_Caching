const express = require('express');
const app = express();
const port = 3000; 


const blogStatsRoute = require('./routes/blogStats');
const blogSearchRoute = require('./routes/blogSearch');

app.use('/api/blog-stats', blogStatsRoute);
app.use('/api/blog-search', blogSearchRoute);

app.listen(process.env.PORT ||port, () => {
  console.log(`Server is running on port ${port}`);
});
