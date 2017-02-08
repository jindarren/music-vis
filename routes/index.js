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
        reqData.token = accessToken
        process.nextTick(function () {
            // To keep the example simple, the user's spotify profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the spotify account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));
/* GET home page. */


var getArtistsByTrack = function () {
    return recom(token).getArtistByTrack()
}

var getGenresByTrack = function () {
    return recom(token).getGenreByTrack()
}

/*
route for web API
 */

router.get('/getArtist',function (req,res) {
    var result = {}
    recom(token).getTopArtists().then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getTrack',function (req,res) {
    var result = {}
    recom(token).getTopTracks().then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getGenre',function (req,res) {
    var result = {}
    recom(token).getTopGenres().then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getRecomByArtist',function (req,res) {
    var result = {}
    recom(token).getRecommendationByArtist(req.query.limit,req.query.seed).then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getRecomByTrack',function (req,res) {
    var result = {}
    recom(token).getRecommendationByTrack(req.query.limit,req.query.seed).then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getRecomByGenre',function (req,res) {
    var result = {}
    recom(token).getRecommendationByGenre(req.query.limit,req.query.seed).then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getAccount',function (req,res) {
    recom(token).getRecommendationByGenre().then(function (data) {
        res.json(data)})
})



router.get('/initiate', function (req, res) {
    //pass token to the webAPI used by recommender
    if (token) {
        var getFollowedArtists =
            recom(token).getFollowedArtists(5).then(function (data) {
                reqData.followed_artist = data;
                reqData.similar_artist = [];
                var artists = []
                var selected_data
                var promise = []

                for(var index in data){
                    artists[index] = data[index].name
                    promise[index] = recom(token).getArtistRelatedArtists(data[index].id).then(function (data) {
                        return data

                    }), function (err) {
                        return err
                    }
                }

                return Promise.all(promise).then(function (data) {
                    selected_data = data[0]
                    for (var index in data){
                        var similar_artists = {}
                        similar_artists.artist = artists[index]
                        similar_artists.similar = data[index]
                        reqData.similar_artist.push(similar_artists)
                    }
                    var seed_artists = '';
                    for (var artistIndex in selected_data) {
                        if (selected_data[artistIndex].id)
                            seed_artists += selected_data[artistIndex].id + ','
                    }
                    seed_artists = seed_artists.substring(0, seed_artists.length - 1)
                    // console.log(seed_artists)
                    return seed_artists
                })

            }).then(function (data) {
                 return recom(token).getRecommendationByFollowedArtist(data,'US');
            }).then(function(recom){
                recommendations.byFollowedArtist = recom
            });

        var getTopArtists =
            recom(token).getTopArtists(5).then(function (data) {
                reqData.artist = data;
                var selected_data = data.slice(0, 5)
                var seed_artists = '';
                for (var artistIndex in selected_data) {
                    if (selected_data[artistIndex].id)
                        seed_artists += selected_data[artistIndex].id + ','
                }
                seed_artists = seed_artists.substring(0, seed_artists.length - 1)
                return seed_artists
            }).then(function (data) {
                return recom(token).getRecommendationByArtist(10, data);
            }).then(function (recom){
                recommendations.byArtist = recom
            });

        var getTracks =
            recom(token).getTopTracks(5).then(function (data) {
                //reqData.track = data.slice(0, 5)
                reqData.track = data
                var selected_data = data.slice(0, 5)
                var seed_tracks = '';
                for (var trackIndex in selected_data) {
                    if (selected_data[trackIndex].id)
                        seed_tracks += selected_data[trackIndex].id + ','
                }
                seed_tracks = seed_tracks.substring(0, seed_tracks.length - 1)
                // console.log(seed_tracks)
                return seed_tracks;
            }).then(function (data) {
                return recom(token).getRecommendationByTrack(10, data);
            }).then(function (recom) {
                recommendations.byTrack = recom
            })

        var getGenres =
            recom(token).getTopGenres().then(function (data) {
                //reqData.genre = data.slice(0, 5)
                reqData.genre = data
                var seed_genres = '';
                for (var genreIndex = 0; genreIndex < 5; genreIndex++) {
                    if (data[genreIndex])
                        seed_genres += data[genreIndex] + ','
                }
                seed_genres = seed_genres.substring(0, seed_genres.length - 1)
                // console.log(seed_genres)
                return seed_genres;
            }).then(function (data) {
                return recom(token).getRecommendationByGenre(10, data)
            }).then(function (recom) {
                recommendations.byGernre = recom
            })


        Promise.all([getFollowedArtists, getTopArtists, getTracks, getGenres]).then(function () {
            // console.log(recommendations)
            // console.log(reqData)
            res.json({
                seed: reqData,
                recom: recommendations
            })
        })
    }
    else {
        reqData.user = req.user;
        res.json({
            seed: reqData
        })
    }
});

router.get('/',function (req,res) {
    res.render('index',{ data: req.user})
})

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
        scope: ['user-read-email', 'user-read-private', 'user-top-read', 'user-follow-read'],
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
