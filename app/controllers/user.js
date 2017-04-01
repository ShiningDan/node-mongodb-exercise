let User = require('../models/user');

exports.signin = function(req, res) {
    let _user = req.body.user;
    let name = _user.name;
    let password = _user.password;

    User.findOne({name: name}, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            return res.redirect('/signup');
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                req.session.user = user;

                res.redirect('/');
            } else {
                res.redirect('/signin');
                console.log("Password is not matched");
            }
        })
    })
}

exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面',
    });
}

exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面',
    });
}

exports.signup = function(req, res) {
    let userid = req.body.user;

    let user = new User(userid);
    User.find({name: user.name}, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            return res.redirect('/signin');
        } else {
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/')
            });
        }
    });
}

exports.logout = function(req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}

exports.list = function(req, res) { 
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: 'ShiningDan 列表页',
            users: users,
        })
    })
}