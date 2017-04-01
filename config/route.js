let Index = require('../app/controllers/index');
let User = require('../app/controllers/user');
let Movie = require('../app/controllers/movie');

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
    app.get('/admin/userlist', User.list);

    app.get('/movie/:id', Movie.detail);
    app.get('/admin/update/:id', Movie.update);
    app.get('/admin/movie', Movie.save);
    app.post('/admin/movie/new', Movie.new);
    app.get('/admin/list', Movie.list);
    app.delete('/admin/list', Movie.del)
}