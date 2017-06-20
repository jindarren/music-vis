var express = require('express');
var router = express.Router();
var recom = require('./recommender');
var passport = require('passport');
var SpotifyStrategy = require('../node_modules/passport-spotify/lib/passport-spotify/index').Strategy;
var path = require('path');
var request = require('request')
var loginbase = "/login-g1"

var appKey = 'a1d9f15f6ba54ef5aea0c5c4e19c0d2c';
var appSecret = 'b368bdb3003747ec861e62d3bf381ba0';

//var recommendations = {};
var token, refresh, userid;

var mongoose = require('mongoose');
mongoose.connect('mongodb://2869fffe50a7cc9c4a1b5204e57d1446:2010ljsby@mongodb://32-1a.mongo.evennode.com:27017,32-1b.mongo.evennode.com:27017/2869fffe50a7cc9c4a1b5204e57d1446?replicaSet=eusbg1');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("connected")
});


var loggerSchema = mongoose.Schema({
    testid : String,
    time : Date,
    path : String,
    low : Number,
    mod : Number,
    high : Number,
    details : Number,
    highlight : Number,
    adding : Number,
    switch : Number,
    rating : Array
})

var Logger = mongoose.model('Logger', loggerSchema)

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
        callbackURL: 'http://spotify-recsys.eu-3.evennode.com/callback',
        //callbackURL: 'http://localhost:3000/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        refresh = refreshToken
        token = accessToken;
        token = accessToken
        userid = profile.id
        process.nextTick(function () {
            // To keep the example simple, the user's spotify profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the spotify account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });

        setInterval(function () {

            var refreshToken = function (refreshToken, clientID, clientSecret, next) {
                var auth = 'Basic ' +  (new Buffer(clientID + ':' + clientSecret).toString('base64'))
                    , opts = {
                    uri: 'https://accounts.spotify.com/api/token',
                    method: 'POST',
                    form: {
                        'grant_type': 'refresh_token',
                        'refresh_token': refreshToken
                    },
                    headers: {
                        'Authorization': auth
                    },
                    json:true
                }
                return request(opts, next)
            }

            refreshToken(refresh, appKey, appSecret, function (err, res, body) {
                if (err) return
                console.log(refresh, appKey, appSecret, body)
                // var result = JSON.parse(body);
                token = body.access_token;
                //refresh = body.refresh_token;
            })
        }, 1000 * 3500)
    }));


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

router.get('/getRecomByFollowSimilar',function (req,res) {
    var result = {}
    recom(token).getArtistRelatedArtists(req.query.id).then(function (data) {
        var selectedRelated = data.slice(0,5);
        result.similar = selectedRelated
        return selectedRelated
    }).then(function (data) {
        recom(token).getRecommendationByFollowedArtist(data,'US').then(function (data) {
            result.items = data
            res.json(result)
        })
    })
})

router.get('/getAccount',function (req,res) {
    recom(token).getRecommendationByGenre().then(function (data) {
        res.json(data)})
})



router.get('/initiate', function (req, res) {
    //pass token to the webAPI used by recommender
    if (token) {
        var reqData = {};
        reqData.token = token;
        reqData.id = userid;

        var getFollowedArtists =
            recom(token).getFollowedArtists(20).then(function (data) {
                reqData.followed_artist = data;
            });


        var getTopArtists =
            recom(token).getTopArtists(20).then(function (data) {
                reqData.artist = data;
            });


        var getTracks =
            recom(token).getTopTracks(20).then(function (data) {
                reqData.track = data
            });


        var getGenres =
            recom(token).getTopGenres().then(function (data) {
                reqData.genre = data
            });



        Promise.all([getFollowedArtists, getTopArtists, getTracks, getGenres]).then(function () {
            res.json({
                seed: reqData
            })
        })
    }
    // else {
    //     reqData.user = req.user;
    //     res.json({
    //         seed: reqData
    //     })
    // }
});

//logging system
router.post("/addRecord", function(req, res){

    console.log(req.body)

    var logger = new Logger({
        testid : req.body.testid,
        time : req.body.time,
        path : req.body.path,
        low : req.body.low_con,
        mod : req.body.mod_con,
        high : req.body.high_con,
        details : req.body.details,
        highlight : req.body.highlight,
        adding : req.body.adding,
        switch : req.body.switch,
        rating : req.body.rating
    })

    logger.save(function (err) {
        if (err) return console.error(err);
    });

    res.send(200, "success");


});

router.get('/login-g1',function (req,res) {
    loginbase = '/login-g1'
    res.render('login-g1',{ data: req.user})
})

router.get('/login-g2',function (req,res) {
    loginbase = '/login-g2'
    res.render('login-g2',{ data: req.user})
})

router.get('/login-g3',function (req,res) {
    loginbase = '/login-g3'
    res.render('login-g3',{ data: req.user})
})

router.get('/test-g1-1',function (req,res) {
    res.render('test-g1-1')
})

router.get('/g1-1',function (req,res) {
    res.render('g1-1', {data: req.user})
})

router.get('/test-g1-2',function (req,res) {
    res.render('test-g1-2')
})

router.get('/g1-2',function (req,res) {
    res.render('g1-2', {data: req.user})
})

router.get('/test-g1-3',function (req,res) {
    res.render('test-g1-3')
})

router.get('/g1-3',function (req,res) {
    res.render('g1-3', {data: req.user})
})


router.get('/test-g2-1',function (req,res) {
    res.render('test-g2-1')
})

router.get('/g2-1',function (req,res) {
    res.render('g2-1', {data: req.user})
})

router.get('/test-g2-2',function (req,res) {
    res.render('test-g2-2')
})

router.get('/g2-2',function (req,res) {
    res.render('g2-2', {data: req.user})
})

router.get('/test-g2-3',function (req,res) {
    res.render('test-g2-3')
})

router.get('/g2-3',function (req,res) {
    res.render('g2-3', {data: req.user})
})


router.get('/test-g3-1',function (req,res) {
    res.render('test-g3-1')
})

router.get('/g3-1',function (req,res) {
    res.render('g3-1', {data: req.user})
})

router.get('/test-g3-2',function (req,res) {
    res.render('test-g3-2')
})

router.get('/g3-2',function (req,res) {
    res.render('g3-2', {data: req.user})
})

router.get('/test-g3-3',function (req,res) {
    res.render('test-g3-3')
})

router.get('/g3-3',function (req,res) {
    res.render('g3-3', {data: req.user})
})


router.get('/logged',function (req,res) {
    res.render('index', {data: req.user})
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
            if(loginbase=="/login-g1")
                res.redirect('/test-g1-1');
            else if(loginbase=="/login-g2")
                res.redirect('/test-g2-1');
            else if(loginbase=="/login-g3")
                res.redirect('/test-g3-1');
        }
);

router.get('/logout', function (req, res) {
    req.logout();
    if(loginbase=="/login-g1")
        res.redirect('/login-g1');
    else if(loginbase=="/login-g2")
        res.redirect('/login-g2');
    else if(loginbase=="/login-g3")
        res.redirect('/login-g3');
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
    if(loginbase=="/login-g1")
        res.redirect('/test-g1-1');
    else if(loginbase=="/login-g2")
        res.redirect('/test-g2-1');
    else if(loginbase=="/login-g3")
        res.redirect('/test-g3-1');
}

module.exports = router;