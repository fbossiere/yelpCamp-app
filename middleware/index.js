const Campground = require("../models/campground");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "Please login first.");
        res.redirect('/login');
    }
};

middlewareObj.isCampgroundAuthor = function(req, res, next) {
    if (req.isAuthenticated()) {
         Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
             if(err){
                 console.log("Could not find campground.");
                 res.redirect('back');
             } else {
                 console.log("Successfully found campground.");
                 if(req.user._id.equals(campground.author.id)){
                     return next();
                 } else {
                     req.flash("error", "Unauthorized action. You do not own the campground.");
                     console.log("Unauthorized. User has to own the campground.");
                     res.redirect('/login');
                 }
             }
         });
    } else {
        console.log("Unauthorized. User has to login.");
        req.flash("error", "Please Login First.");
        res.redirect('/login');
    }
};


module.exports = middlewareObj;