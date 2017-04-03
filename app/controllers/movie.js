let Movie = require('../models/movie');
let Comment = require('../models/comment');
let Category = require('../models/category');
let underScore = require('underscore');

exports.detail = function(req, res) {   // 访问 /admin/3 返回 detail.jade 渲染后的效果
    let id = req.params.id;
    Movie.findById(id, function(err, movie) {
        if (err) {
            console.log(err);
        }
        Comment.find({movie: id})
        .populate('from', 'name')
        .populate('reply.from reply.to', 'name')
        .exec(function(err, comments) {
            res.render('detail', {
                title: movie.title,
                movie: movie,
                comments: comments
            })
        });
    })  
}

exports.update = function(req, res) {
    let id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: 'shiningdan 后台更新页面',
                    movie: movie,
                    categories: categories,
                })
            })
        })
    }
}

exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: 'shiningdan 后台录入页',
            movie: {},
            categories: categories,
        })
    });
}

exports.save = function(req, res) {
    let movieObj = req.body.movie;
    let id = movieObj._id;
    let _movie;
    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = underScore.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = Movie(movieObj);
        // _id 在调用 Movie() 的时候会自动生成
        let categoryId = _movie.category;
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }

            Category.findById(categoryId, function(err, category) {
                category.movies.push(_movie._id);
                category.save(function(err, category) {
                    res.redirect('/movie/' + movie._id);
                })
            })
        })
    }
}

exports.list = function(req, res) {  //访问 /admin/list 返回 list.jade 渲染后的效果
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'ShiningDan 列表页',
            movies: movies,
        })
    })
}

exports.del = function(req, res) {
    let id = req.query.id;
    
    if (id) {
        Movie.remove({_id: id}, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        })
    }
}