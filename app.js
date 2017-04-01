let express = require('express');
let path = require('path');
let serveStatic = require('serve-static');
let bodyPaerser = require('body-parser');
let underScore = require('underscore');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mongoStore = require('connect-mongo')(session);
let morgan = require('morgan');

mongoose.Promise = global.Promise;
let dbUrl = 'mongodb://127.0.0.1:27017/test';
mongoose.connect(dbUrl);

let port = process.env.PORT || 3000;
let app = express();

app.set('views', './app/views/pages/');  // 应用的视图目录
app.set('view engine', 'jade'); // 应用的视图引擎
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(bodyPaerser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: 'zyc',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions',
    }),
}));
app.locals.moment = require('moment');
console.log('listen to port', port);
app.listen(port);

if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true); 
}

require('./config/route')(app);