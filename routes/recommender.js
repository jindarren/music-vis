/**
 * Created by jin on 12/11/2016.
 */
var recommender = function (token) {
    var SpotifyWebApi = require('spotify-web-api-node'),
        appKey = 'a1d9f15f6ba54ef5aea0c5c4e19c0d2c',
        appSecret = '592a9effa09b4ab8b8c87e439c9b014b',
        redirectUrl = 'http://localhost:3302/spotify/callback';

    var spotifyApi = new SpotifyWebApi({
        clientId: appKey,
        clientSecret: appSecret,
        redirectUri: redirectUrl
    });

    spotifyApi.setAccessToken(token);

    return {
         getTopArtists: function (limitNum) {
            return spotifyApi.getMyTopArtists({
                time_range: 'long_term',
                limit: limitNum,
            }).then(function (data) {
                return data.body
            }, function (err) {
                return err;
            });
        },

        getTopTracks: function (limitNum) {
            return spotifyApi.getMyTopTracks({
                time_range: 'long_term',
                limit: limitNum,
            }).then(function (data) {
                return data.body
            }, function (err) {
                return err;
            });
        },

        getTopGenres: function (){
             return spotifyApi.getAvailableGenreSeeds()
                 .then(function (data) {
                     return data.body
                 },function (err) {
                     return err
                 })
        },

        getRecommendationByArtist:function (limitNum,seeds) {
             return spotifyApi.getRecommendations({
                 limit:limitNum,
                 seed_artists:seeds
             }).then(function(data){
                 return data.body
             },function (err) {
                return err;
             })
        },

        getRecommendationByTrack:function (limitNum,seeds) {
            return spotifyApi.getRecommendations({
                limit:limitNum,
                seed_tracks:seeds
            }).then(function(data){
                return data.body
            },function (err) {
                return err;
            })
        },

        getRecommendationByGenre:function (limitNum,seeds) {
            return spotifyApi.getRecommendations({
                limit:limitNum,
                seed_genres:seeds
            }).then(function(data){
                return data.body
            },function (err) {
                return err;
            })
        }
    }
};


module.exports = recommender;