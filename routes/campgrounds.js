const express       = require("express"),
      Campground    = require("../models/campground");
  
const router  = express.Router();


router.get("/", function(req, res) {
    var campgrounds = Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log('Could not find campgrounds because of the following error:');
            console.log(err);
        }
        else {
            console.log('Found campgrounds');
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
                currentUser: req.user
            });
        }
    });

});

router.get('/new', function(req, res) {
    res.render('campgrounds/new');
});

router.post("/", function(req, res) {
    Campground.create(req.body.campground, function(err, campground) {
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

router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if(err){
            console.log('Could not find campground with the following id:');
            console.log(req.params.id);
            console.log(err);
        } else {
            console.log('Successfully found campground with the following id:');
            console.log(req.params.id);
            console.log(campground);
            console.log(campground.comments);
            res.render("campgrounds/show", {campground: campground});
        }
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};


module.exports = router;