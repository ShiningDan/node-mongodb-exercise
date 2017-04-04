
let Movie = require('../models/movie');
let Category = require('../models/category');

exports.index = function(req, res) {
    Category.find({})
    .populate({path: 'movies', options: {limit: 5}})
    .exec(function(err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'Shiningdan 首页',
            categories: categories,
        });
    });
}

exports.search = function(req, res) {
    let catId = req.query.cat;
    let q = req.query.q;
    let page = parseInt(req.query.p, 10) || 0;
    let count = 2;
    let index = page * count;

    if (catId) {
        Category.find({_id: catId})
        .populate({
            path: 'movies',
            select: 'title poster',
        })
        .exec(function(err, categories) {
            if (err) {
                console.log(err);
            }
            let category = categories[0] || {};
            let movies = category.movies || [];
            let results = movies.slice(index, index + count);

            res.render('results', {
                title: 'Shiningdan 分类电影页面',
                keyword: category.name,
                currentPage: (page + 1),
                query: 'cat=' + catId,
                totalPage: Math.ceil(movies.length/count),
                movies: results,
            });
        })
    } else {
        Movie.find({title: new RegExp(q+'.*', 'i')}, function(err, movies) {
            if (err) {
                console.log(err);
            }

            let results = movies.slice(index, index+count);
            res.render('results', {
                title: 'Shiningdan 分类电影页面',
                keyword: q,
                currentPage: (page + 1),
                query: 'cat=' + catId,
                totalPage: Math.ceil(movies.length/count),
                movies: results,
            });
        });
    }  
}