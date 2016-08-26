const   express     = require("express"),
        Campground  = require("../models/campground"),
        Comment     = require("../models/comment");

const router  = express.Router({mergeParams: true});


router.get('/new', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log('Could not find campground with id ' + req.params.id);
        } else{
            console.log('Successfully found campground with id ' + req.params.id);
            res.render('comments/new', {campground: campground});
        }
    });
});

router.post('/', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log('Could not find campground with id ' + req.params.id);
            res.redirect('/campgrounds');
        } else{
            console.log('Successfully found campground with id ' + campground._id);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log('Could not create the following comment:');
                    console.log(req.body.comment);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id)
                    console.log('Successfully created and added comment to campground');
                }
            })
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};


module.exports = router;