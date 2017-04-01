let Index = require('../app/controllers/index');
let User = require('../app/controllers/user');
let Movie = require('../app/controllers/movie');
let Comment = require('../app/controllers/comment');

module.exports = function(app) {
    app.use(function(req, res, next) {
        let _user = req.session.user;
        app.locals.user = _user;
        
        next()
    });

    app.get('/', Index.index);

    app.post('/user/signin', User.signin);
    app.post('/user/signup', User.signup);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/logout', User.logout);
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

    app.post('/user/comment', User.signinRequired, Comment.save);
}