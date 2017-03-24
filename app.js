let express = require('express');
let path = require('path');
let serveStatic = require('serve-static');
let bodyPaerser = require('body-parser');
let underScore = require('underscore');
let mongoose = require('mongoose');

let Movie = require('./models/movie');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/test');

let port = process.env.PORT || 3000;
let app = express();

app.set('views', './views/pages/');  // 应用的视图目录
app.set('view engine', 'jade'); // 应用的视图引擎
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(bodyPaerser.urlencoded({extended: true}));
app.locals.moment = require('moment');
console.log('listen to port', port);
app.listen(port);


app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'ShiningDan 主页',
            movies: movies,
        })
    })
});

app.get('/movie/:id', function(req, res) {   // 访问 /admin/3 返回 detail.jade 渲染后的效果
    let id = req.params.id;
    Movie.findById(id, function(err, movie) {
        if (err) {
            console.log(err);
        }
        res.render('detail', {
            title: movie.title,
            movie: movie,
        })
    })  
})

app.get('/admin/update/:id', function(req, res) {
    let id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'shiningdan 后台更新页面',
                movie: movie,
            })
        })
    }
})


app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'shiningdan 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            language: '',
            year: '',
            flash: '',
            poster: '',
            summary: '',
        }
    })
})

app.post('/admin/movie/new', function(req, res) {
    let movieObj = req.body.movie;
    let id = movieObj._id;
    let _movie;
    if (id !== 'undefined') {
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
        _movie = Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            country: movieObj.country,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
        });
        // _id 在调用 Movie() 的时候会自动生成
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        })
    }
});


app.get('/admin/list', function(req, res) {  //访问 /admin/list 返回 list.jade 渲染后的效果
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'ShiningDan 列表页',
            movies: movies,
        })
    })
})

app.delete('/admin/list', function(req, res) {
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
})