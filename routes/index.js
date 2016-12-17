var express = require('express');
var router = express.Router();
var recom = require('./recommender');
var passport = require('passport');
var SpotifyStrategy = require('../node_modules/passport-spotify/lib/passport-spotify/index.js').Strategy;
var context = '/spotify'
var path    = require('path');


var appKey = 'a1d9f15f6ba54ef5aea0c5c4e19c0d2c';
var appSecret = '592a9effa09b4ab8b8c87e439c9b014b';

var reqData ={};
var token;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
        clientID: appKey,
        clientSecret: appSecret,
        callbackURL: 'http://localhost:3302/spotify/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        token = accessToken;
        console.log(recom(token))
        process.nextTick(function () {
            // To keep the example simple, the user's spotify profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the spotify account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));
/* GET home page. */

router.get(path.join(context, '/'), function(req, res){
    //pass token to the webAPI used by recommender
    var getGenres = []
    console.log(token)
    var getArtists = recom(token).getTopArtist(10).then(function (data) {
        reqData.artist = data;
        for (var artistIndex in data.items){
            if(data.items[artistIndex].genres)
                var genres = data.items[artistIndex].genres
            for (var genreIndex in genres){
                if(getGenres.indexOf(genres[genreIndex])<0)
                    getGenres.push(genres[genreIndex])
            }
        }
        reqData.genre = getGenres
    });

    var getTracks = recom(token).getTopTrack(10).then(function (data) {
        reqData.track = data
    })

    Promise.all([getArtists, getTracks]).then(function () {
        reqData.user = req.user;
        console.log(reqData)
        res.render('index',{data:reqData})
    })
});

router.get(path.join(context, '/account'), ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

router.get(path.join(context, '/login'), function(req, res){
    res.render('login', { user: req.user });
});

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
router.get(path.join(context, '/auth/spotify'),
    passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'user-top-read'], showDialog: true}),
    function(req, res){
// The request will be redirected to spotify for authentication, so this
// function will not be called.
    });

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(path.join(context, '/callback'),
    passport.authenticate('spotify', { failureRedirect: path.join(context, '/login') }),
    function(req, res) {
        res.redirect(path.join(context, '/'));
    });

router.get(path.join(context, '/logout'), function(req, res){
    req.logout();
    res.redirect(path.join(context, '/'));
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect(path.join(context, '/login'));
}

module.exports = router;
