/**
 * Created by jin on 12/11/2016.
 */
var recommender = function (token) {
    var SpotifyWebApi = require('spotify-web-api-node'),
        appKey = 'a1d9f15f6ba54ef5aea0c5c4e19c0d2c',
        appSecret = 'b368bdb3003747ec861e62d3bf381ba0',
        redirectUrl = 'https://spotify-recsys-vis.herokuapp.com:3300/callback';

    var spotifyApi = new SpotifyWebApi({
        clientId: appKey,
        clientSecret: appSecret,
        redirectUri: redirectUrl
    });

    spotifyApi.setAccessToken(token);

    return {

        getFollowedArtists: function (limitNum){
            return spotifyApi.getFollowedArtists({
                type: 'artist',
                limit: limitNum,
            }).then(function (data) {
                return data.body.artists.items
            }, function (err) {
                return err;
            });
        },

        getArtistRelatedArtists: function (id){
            return spotifyApi.getArtistRelatedArtists(id).then(function (data){
                return data.body.artists
            }, function (err) {
                return err
            })
        },

        getTopArtists: function (limitNum) {
            return spotifyApi.getMyTopArtists({
                time_range: 'long_term',
                limit: limitNum,
            }).then(function (data) {
                return data.body.items
            }, function (err) {
                return err;
            });
        },

        getTopTracks: function (limitNum) {
            return spotifyApi.getMyTopTracks({
                time_range: 'long_term',
                limit: limitNum,
            }).then(function (data) {
                return data.body.items
            }, function (err) {
                return err;
            });
        },

        getTopGenres: function () {
            return spotifyApi.getAvailableGenreSeeds()
                .then(function (data) {
                    return data.body.genres
                }, function (err) {
                    return err
                })
        },

        getRecommendationByFollowedArtist: function (artists, country) {
            var promise = []

            for (var index in artists){
                promise[index]=spotifyApi.getArtistTopTracks(artists[index].id, country).then(function(data){
                    return data.body.tracks
                }), function (err) {
                    return err
                }
            }

            return Promise.all(promise).then(function(data){
                var recommendations = []
                for (var index in data){
                    recommendations = recommendations.concat(data[index])
                }
                // console.log(recommendations)
                return recommendations
            })
        },


        getRecommendationByArtist: function (limitNum, seeds) {
            return spotifyApi.getRecommendations({
                limit: limitNum,
                seed_artists: seeds
            }).then(function (data) {
                return data.body.tracks
            }, function (err) {
                return err;
            })
        },

        getRecommendationByTrack: function (limitNum, seeds) {
            return spotifyApi.getRecommendations({
                limit: limitNum,
                seed_tracks: seeds
            }).then(function (data) {
                return data.body.tracks
            }, function (err) {
                return err;
            })
        },

        getRecommendationByGenre: function (limitNum, seeds) {
            return spotifyApi.getRecommendations({
                limit: limitNum,
                seed_genres: seeds
            }).then(function (data) {
                return data.body.tracks
            }, function (err) {
                return err;
            })
        },

    }
};


module.exports = recommender;