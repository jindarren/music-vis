/**
 * Created by jin on 12/11/2016.
 */
var recommender = function (token) {
    var SpotifyWebApi = require('spotify-web-api-node'),
        appKey = 'xxxxxxxxxxxxxxxxxxxxxxxxx',
        appSecret = 'xxxxxxxxxxxxxxxxxxxxxxxxx',
        redirectUrl = 'http://spotify-avi.us-3.evennode.com/callback';
        //redirectUrl = 'http://localhost:3000/callback';

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


        getRecommendation: function (limitNum, artistSeeds, trackSeeds, genreSeeds, min_danceability, max_danceability,
                                             min_energy, max_energy, min_instrumentalness, max_instrumentalness, min_liveness, max_liveness,
                                             min_speechiness, max_speechiness, min_valence,max_valence) {
            return spotifyApi.getRecommendations({
                limit: limitNum,
                seed_artists: artistSeeds,
                seed_tracks: trackSeeds,
                seed_genres: genreSeeds,
                min_danceability: min_danceability,
                max_danceability: max_danceability,
                min_energy: min_energy,
                max_energy: max_energy,
                min_instrumentalness: min_instrumentalness,
                max_instrumentalness: max_instrumentalness,
                min_liveness: min_liveness,
                max_liveness: max_liveness,
                min_speechiness: min_speechiness,
                max_speechiness: max_speechiness,
                min_valence: min_valence,
                max_valence: max_valence
            }).then(function (data) {
                return data.body.tracks
            }, function (err) {
                return err;
            })
        },


        getRecommendationByArtist: function (limitNum, seeds, min_danceability, max_danceability,
                                             min_energy, max_energy, min_instrumentalness, max_instrumentalness, min_liveness, max_liveness,
                                             min_speechiness, max_speechiness, min_valence,max_valence) {
            return spotifyApi.getRecommendations({
                limit: limitNum,
                seed_artists: seeds,
                min_danceability: min_danceability,
                max_danceability: max_danceability,
                min_energy: min_energy,
                max_energy: max_energy,
                min_instrumentalness: min_instrumentalness,
                max_instrumentalness: max_instrumentalness,
                min_liveness: min_liveness,
                max_liveness: max_liveness,
                min_speechiness: min_speechiness,
                max_speechiness: max_speechiness,
                min_valence: min_valence,
                max_valence: max_valence
            }).then(function (data) {
                return data.body.tracks
            }, function (err) {
                return err;
            })
        },

        getRecommendationByTrack: function (limitNum, seeds, min_danceability, max_danceability,
                                            min_energy, max_energy, min_instrumentalness, max_instrumentalness, min_liveness, max_liveness,
                                            min_speechiness, max_speechiness, min_valence,max_valence) {
            return spotifyApi.getRecommendations({
                limit: limitNum,
                seed_tracks: seeds,
                min_danceability: min_danceability,
                max_danceability: max_danceability,
                min_energy: min_energy,
                max_energy: max_energy,
                min_instrumentalness: min_instrumentalness,
                max_instrumentalness: max_instrumentalness,
                min_liveness: min_liveness,
                max_liveness: max_liveness,
                min_speechiness: min_speechiness,
                max_speechiness: max_speechiness,
                min_valence: min_valence,
                max_valence: max_valence
            }).then(function (data) {
                return data.body.tracks
            }, function (err) {
                return err;
            })
        },

        getRecommendationByGenre: function (limitNum, seeds, min_danceability, max_danceability,
                                            min_energy, max_energy, min_instrumentalness, max_instrumentalness, min_liveness, max_liveness,
                                            min_speechiness, max_speechiness, min_valence,max_valence) {
            return spotifyApi.getRecommendations({
                limit: limitNum,
                seed_genres: seeds,
                min_danceability: min_danceability,
                max_danceability: max_danceability,
                min_energy: min_energy,
                max_energy: max_energy,
                min_instrumentalness: min_instrumentalness,
                max_instrumentalness: max_instrumentalness,
                min_liveness: min_liveness,
                max_liveness: max_liveness,
                min_speechiness: min_speechiness,
                max_speechiness: max_speechiness,
                min_valence: min_valence,
                max_valence: max_valence
            }).then(function (data) {
                return data.body.tracks
            }, function (err) {
                return err;
            })
        },

    }
};


module.exports = recommender;
