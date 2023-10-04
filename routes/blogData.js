let blogs = []

const setBlogsData = (data)=>{
    blogs = data;
};

const getBlogsData = ()=>{
    return blogs;
};

module.exports = { setBlogsData , getBlogsData};