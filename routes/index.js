var express = require('express');
var router = express.Router();
var recom = require('./recommender');
var passport = require('passport');
var SpotifyStrategy = require('../node_modules/passport-spotify/lib/passport-spotify/index.js').Strategy;
var path = require('path');


var appKey = 'a1d9f15f6ba54ef5aea0c5c4e19c0d2c';
var appSecret = '592a9effa09b4ab8b8c87e439c9b014b';

var reqData = {};
var recommendations = {};
var token;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
        clientID: appKey,
        clientSecret: appSecret,
        callbackURL: 'http://localhost:3000/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        token = accessToken;
        process.nextTick(function () {
            // To keep the example simple, the user's spotify profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the spotify account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));
/* GET home page. */

router.get('/', function (req, res) {
    //pass token to the webAPI used by recommender
    console.log("my token " + token)
    if (token) {
        console.log(token)

        var getArtists =
            recom(token).getTopArtists(5).then(function (data) {
                reqData.artist = data.items.slice(0,5);

                var seed_artists = '';
                for (var artistIndex in data.items) {
                    if (data.items[artistIndex].id)
                        seed_artists += data.items[artistIndex].id + ','
                }
                seed_artists = seed_artists.substring(0, seed_artists.length - 1)
                return seed_artists
            }).then(function (data) {
                return recom(token).getRecommendationByArtist(10, data);
            }).then(function (recom) {
                recommendations.byArtist = recom;
            });

        var getTracks =
            recom(token).getTopTracks(5).then(function (data) {
                reqData.track = data.items.slice(0,5)
                var seed_tracks = '';
                for (var trackIndex in data.items) {
                    if (data.items[trackIndex].id)
                        seed_tracks += data.items[trackIndex].id + ','
                }
                seed_tracks = seed_tracks.substring(0, seed_tracks.length - 1)
                return seed_tracks;
            }).then(function (data) {
                return recom(token).getRecommendationByTrack(10, data);
            }).then(function (recom) {
                recommendations.byTrack = recom
            })

        var getGenres =
            recom(token).getTopGenres().then(function (data) {
                reqData.genre = data.genres.slice(0,5)
                var seed_genres = '';
                for (var genreIndex = 0; genreIndex < 5; genreIndex++) {
                    if (data.genres[genreIndex])
                        seed_genres += data.genres[genreIndex] + ','
                }
                seed_genres = seed_genres.substring(0, seed_genres.length - 1)
                return seed_genres;
            }).then(function (data) {
                return recom(token).getRecommendationByGenre(10, data)
            }).then(function (recom) {
                recommendations.byGernre = recom
            })

        Promise.all([getArtists, getTracks, getGenres]).then(function () {

            console.log(recommendations)

            reqData.user = req.user;
            console.log(reqData)
            res.render('index', {
                data: reqData,
                recom: recommendations
            })
        })
    }
    else {
        reqData.user = req.user;
        res.render('index',{
            data:reqData
        })
    }
});

router.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', {user: req.user});
});


// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
router.get('/auth/spotify',
    passport.authenticate('spotify', {
        scope: ['user-read-email', 'user-read-private', 'user-top-read'],
        showDialog: true
    }),
    function (req, res) {
// The request will be redirected to spotify for authentication, so this
// function will not be called.
    });

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/callback',
    passport.authenticate('spotify', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
