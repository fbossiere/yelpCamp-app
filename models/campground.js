var mongoose = require("mongoose");
require('mongoose-type-url');

var campgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: mongoose.SchemaTypes.Url,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Campground', campgroundSchema);