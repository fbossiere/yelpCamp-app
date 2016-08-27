const express       = require("express"),
      Campground    = require("../models/campground"),
      middlewareObj = require("../middleware");
  
const router  = express.Router();


router.get("/", function(req, res) {
    var campgrounds = Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log('Could not find campgrounds because of the following error:');
            console.log(err);
        }
        else {
            console.log('Successfully found campgrounds');
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
                currentUser: req.user
            });
        }
    });

});

router.get('/new', middlewareObj.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {
    Campground.create(req.body.campground, function(err, campground) {
        if (err) {
            console.log('Could not create the campground because of the following error:');
            console.log(err);
        }
        else {
            campground.author = {
                id: req.user._id,
                username: req.user.username
            }
            campground.save();
            console.log('Successfully created campground:');
            req.flash("success", "Campground successfully created.");
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
            res.render("campgrounds/show", {campground: campground});
        }
    })
});

router.get('/:id/edit', middlewareObj.isCampgroundAuthor, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds/' + req.params.id);
           
        } else{
            console.log('Successfully found campground.');
            res.render('campgrounds/edit', {campground: campground});
        }
    });
});

router.put('/:id', middlewareObj.isCampgroundAuthor, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            console.log(err);
            res.render('campgrounds/edit');
        } else{
            console.log('Successfully edited campground.');
            req.flash("success", "Campground successfully edited.");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:id', middlewareObj.isCampgroundAuthor, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds/' + req.params.id);
        } else{
            console.log('Successfully deleted campground.');
            req.flash("success", "Campground successfully deleted.");
            res.redirect('/campgrounds/');
        }
    });
});

module.exports = router;