var express = require('express');
var router = express.Router();
var recom = require('./recommender');
var passport = require('passport');
var SpotifyStrategy = require('../node_modules/passport-spotify/lib/passport-spotify/index').Strategy;
var path = require('path');
var request = require('request');
var User = require('../model/user');

var appKey = 'a1d9f15f6ba54ef5aea0c5c4e19c0d2c';
var appSecret = 'b368bdb3003747ec861e62d3bf381ba0';

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
        callbackURL: 'http://spotify-avi.us-3.evennode.com/callback'
        //callbackURL: 'http://localhost:3000/callback'
    },
        function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...

        process.nextTick(function () {
            // To keep the example simple, the user's spotify profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the spotify account with a user record in your database,
            // and return that user instead.
            return done(null, profile, {accessToken: accessToken, refreshToken: refreshToken});
        });

    }));

router.post("/addRecord", function(req, res){
    var user = new User({
        id : req.body.id,
        setting : req.body.setting,
        duration: req.body.duration,
        rating: req.body.rating,
        likedTime: req.body.likedTime,
        lowSortingTime: req.body.lowSortingTime,
        lowRemovingTime: req.body.lowRemovingTime,
        lowRatingTimes: req.body.lowRatingTimes,
        middleDraggingTime: req.body.middleDraggingTime,
        middleLoadMoreTime: req.body.middleLoadMoreTime,
        highSliderTime: req.body.highSliderTime,
        highSortingTime: req.body.highSortingTime,
        detailTime:req.body.detailTime
    });
    console.log(req.body)
    user.save(function (err) {
        if (err)
            res.send(err);
        res.json({message: "user profile is updated"})
    })
});


router.get("/getRecord", function(req, res){
    User.find({},function (err, user) {
        if (err)
            res.send(err);
        else{
            res.send(user)
        }
    })
});


router.get('/play',function (req,res) {
    res.render('play',{data: req.user})
})

router.get('/logout',function (req,res) {
    res.render('logout')
})


router.get('/s1',function (req,res) {
    res.render('s1',{ data: req.user})
})

router.get('/s2',function (req,res) {
    res.render('s2',{ data: req.user})
})

router.get('/s3',function (req,res) {
    res.render('s3',{ data: req.user})
})

router.get('/s4',function (req,res) {
    res.render('s4',{ data: req.user})
})

router.get('/s5',function (req,res) {
    res.render('s5',{ data: req.user})
})

router.get('/s6',function (req,res) {
    res.render('s6',{ data: req.user})
})

router.get('/s7',function (req,res) {
    res.render('s7',{ data: req.user})
})

router.get('/s8',function (req,res) {
    res.render('s8',{ data: req.user})
})

router.get('/login-s1',function (req,res) {
    res.render('login-s1')
})

router.get('/login-s2',function (req,res) {
    res.render('login-s2')
})

router.get('/login-s3',function (req,res) {
    res.render('login-s3')
})

router.get('/login-s4',function (req,res) {
    res.render('login-s4')
})

router.get('/login-s5',function (req,res) {
    res.render('login-s5')
})

router.get('/login-s6',function (req,res) {
    res.render('login-s6')
})

router.get('/login-s7',function (req,res) {
    res.render('login-s7')
})

router.get('/login-s8',function (req,res) {
    res.render('login-s8')
})


/*
 route for web API
 */

router.get('/getArtist',function (req,res) {
    var result = {}
    recom(req.query.token).getTopArtists().then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getTrack',function (req,res) {
    var result = {}
    recom(req.query.token).getTopTracks().then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getGenre',function (req,res) {
    var result = {}
    recom(req.query.token).getTopGenres().then(function (data) {
        result.items = data;
        res.json(result)})
})


router.get('/getRecom',function (req,res) {
    var result = {}
    recom(req.query.token).getRecommendation(req.query.limit,req.query.artistSeed,req.query.trackSeed,req.query.genreSeed,req.query.min_danceability, req.query.max_danceability,
        req.query.min_energy, req.query.max_energy, req.query.min_instrumentalness, req.query.max_instrumentalness, req.query.min_liveness, req.query.max_liveness,
        req.query.min_speechiness, req.query.max_speechiness, req.query.min_valence, req.query.max_valence).then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getRecomByArtist',function (req,res) {
    var result = {}
    recom(req.query.token).getRecommendationByArtist(req.query.limit,req.query.seed,req.query.min_danceability, req.query.max_danceability,
        req.query.min_energy, req.query.max_energy, req.query.min_instrumentalness, req.query.max_instrumentalness, req.query.min_liveness, req.query.max_liveness,
        req.query.min_speechiness, req.query.max_speechiness, req.query.min_valence, req.query.max_valence).then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getRecomByTrack',function (req,res) {
    var result = {}
    recom(req.query.token).getRecommendationByTrack(req.query.limit,req.query.seed,req.query.min_danceability, req.query.max_danceability,
        req.query.min_energy, req.query.max_energy, req.query.min_instrumentalness, req.query.max_instrumentalness, req.query.min_liveness, req.query.max_liveness,
        req.query.min_speechiness, req.query.max_speechiness, req.query.min_valence, req.query.max_valence).then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getRecomByGenre',function (req,res) {
    var result = {}
    recom(req.query.token).getRecommendationByGenre(req.query.limit,req.query.seed,req.query.min_danceability, req.query.max_danceability,
        req.query.min_energy, req.query.max_energy, req.query.min_instrumentalness, req.query.max_instrumentalness, req.query.min_liveness, req.query.max_liveness,
        req.query.min_speechiness, req.query.max_speechiness, req.query.min_valence, req.query.max_valence).then(function (data) {
        result.items = data;
        res.json(result)})
})

router.get('/getRecomByFollowSimilar',function (req,res) {
    var result = {}
    recom(req.query.token).getArtistRelatedArtists(req.query.id).then(function (data) {
        var selectedRelated = data.slice(0,5);
        result.similar = selectedRelated
        return selectedRelated
    }).then(function (data) {
        recom(req.query.token).getRecommendationByFollowedArtist(data,'US').then(function (data) {
            result.items = data
            res.json(result)
        })
    })
})

router.get('/getAccount',function (req,res) {
    recom(req.query.token).getRecommendationByGenre().then(function (data) {
        res.json(data)})
})


router.get('/initiate', function (req, res) {
    //pass token to the webAPI used by recommender

    var reqData = {};

    var getTopArtists =
        recom(req.query.token).getTopArtists(50).then(function (data) {
            reqData.artist = data;
        });


    var getTracks =
        recom(req.query.token).getTopTracks(50).then(function (data) {
            reqData.track = data
        });


    var getGenres =
        recom(req.query.token).getTopGenres().then(function (data) {
            reqData.genre = data
        });

    Promise.all([getTopArtists, getTracks, getGenres]).then(function () {
        res.json({
            seed: reqData
        })
    })

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

        res.cookie('spotify-token', req.authInfo.accessToken, {
            maxAge: 3600000
        });

        res.cookie('refresh-token', req.authInfo.refreshToken, {
            maxAge: 3600000
        });

        res.redirect('/play');

    });

//
// setInterval(function () {
//     var refreshToken = function (refreshToken, clientID, clientSecret, next) {
//         var auth = 'Basic ' +  (new Buffer(clientID + ':' + clientSecret).toString('base64'))
//             , opts = {
//             uri: 'https://accounts.spotify.com/api/token',
//             method: 'POST',
//             form: {
//                 'grant_type': 'refresh_token',
//                 'refresh_token': refreshToken
//             },
//             headers: {
//                 'Authorization': auth
//             },
//             json:true
//         }
//         return request(opts, next)
//     }
//
//     refreshToken(refresh, appKey, appSecret, function (err, res, body) {
//         if (err) return
//         console.log(refresh, appKey, appSecret, body)
//         // var result = JSON.parse(body);
//         // token = body.access_token;
//         // reqData.token = body.access_token;
//         //refresh = body.refresh_token;
//     })
// }, 1000*3600)


router.get('/refresh-token', function(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(appKey + ':' + appSecret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            var refresh_token = body.refresh_token;
            res.json({
                'access_token': access_token,
                'refresh_token': refresh_token
            });
        }
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/logout")
});


module.exports = router;