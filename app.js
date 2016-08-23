var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var mongoose = require("mongoose");
require('mongoose-type-url');

mongoose.connect('mongodb://localhost/yelpcamp_app');

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
    }
});

var Campground = mongoose.model('Campground', campgroundSchema);
// var campgrounds = [{
//     name: 'Salmon Creek',
//     image: 'http://www.yellowstonenationalparklodges.com/wp-content/gallery/bridge-bay-campground/bridge-bay-campground-1.jpg'
// }, {
//     name: 'Granite Hill',
//     image: 'http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-11.jpg'
// }, {
//     name: 'Corona Beach',
//     image: 'https://s3-media4.fl.yelpcdn.com/bphoto/BMPQy9NO-FIb6g06GosNIA/348s.jpg'
// }, {
//     name: 'Granite Hill',
//     image: 'http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-11.jpg'
// }, {
//     name: 'Corona Beach',
//     image: 'https://s3-media4.fl.yelpcdn.com/bphoto/BMPQy9NO-FIb6g06GosNIA/348s.jpg'
// }, {
//     name: 'Granite Hill',
//     image: 'http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-11.jpg'
// }, {
//     name: 'Corona Beach',
//     image: 'https://s3-media4.fl.yelpcdn.com/bphoto/BMPQy9NO-FIb6g06GosNIA/348s.jpg'
// }, {
//     name: 'Granite Hill',
//     image: 'http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-11.jpg'
// }, {
//     name: 'Corona Beach',
//     image: 'https://s3-media4.fl.yelpcdn.com/bphoto/BMPQy9NO-FIb6g06GosNIA/348s.jpg'
// }];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    var campgrounds = Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log('Could not find campgrounds because of the following error:');
            console.log(err);
        }
        else {
            console.log('Found the following campground:');
            console.log(campgrounds);
            res.render("index", {
                campgrounds: campgrounds
            });
        }
    });

});

app.get('/campgrounds/new', function(req, res) {
    res.render('new');
});

app.post("/campgrounds", function(req, res) {
    var newCampground = {
        name: req.body.newCampgroundName,
        imageURL: req.body.newCampgroundImage,
        description: req.body.newCampgroundDescription
    };
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log('Could not create the campground because of the following error:');
            console.log(err);
        }
        else {
            console.log('Successfully created the following campground:');
            console.log(campground);
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log('Could not find campground with the following id:');
            console.log(req.params.id);
            console.log(err);
        } else{
            console.log('Successfully found campground with the following id:');
            console.log(req.params.id);
            console.log(campground);
            res.render("show", {campground: campground});
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is listening!")
});
