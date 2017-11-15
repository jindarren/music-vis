var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    mongoose = require('mongoose');


var port         = process.env.port || 3000;
var index = require('./routes/index');
var app = express();

mongoose.connection.openUri('mongodb://6938bf9f1157f79dea32a0e3caed7284:2010qhyjs@5a.mongo.evennode.com:27017,5b.mongo.evennode.com:27017/spotify?replicaSet=us-5', function (err) {
    if (err) {
        console.log("connection error", err);

    } else {
        console.log('connection successful!');
    }
});

// const https = require('https');
// const fs = require('fs');
//
// const options = {
//     key: fs.readFileSync('../../../../../etc/ssl/certs/daddi.pem'),
//     cert: fs.readFileSync('../../../../../etc/ssl/certs/daddi.pem')
// };


app.set('trust proxy', 1); // trust first proxy

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie:{secure:true}
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// https.createServer(options,app).listen(port);
// console.log('listening at:', port);

app.listen(port, function(){
  console.log('Now it is listening the port ' +port)
});

module.exports = app;