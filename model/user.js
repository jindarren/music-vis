/**
 * Created by yucheng on 14/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    timestamp: Date,
    id: String,
    setting: String,
    duration: Number,
    rating: {
        id: [],
        likes:[]
    },
    likedTime: Number,
    lowSortingTime: Number,
    lowRemovingTime: Number,
    lowRatingTimes: Number,
    middleDraggingTime: Number,
    middleLoadMoreTime: Number,
    highSliderTime: Number,
    highSortingTime: Number,
    detailTime:Number
}));