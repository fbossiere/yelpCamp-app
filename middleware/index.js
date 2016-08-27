const Campground = require("../models/campground");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
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
                     console.log("Unauthorized. User has to own the campground.");
                     res.redirect('/login');
                 }
             }
         });
    } else {
        console.log("Unauthorized. User has to login.");
        res.redirect('/login');
    }
};


module.exports = middlewareObj;