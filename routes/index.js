const express   = require("express"),
      User      = require("../models/user"),
      passport  = require('passport');
      
const router  = express.Router();


router.get("/", function(req, res) {
    res.render("landing");
});

router.get('/register', function(req, res){
    res.render('authentication/register');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect('/register');
        } else {
            req.flash("success", "User " + user.username +  " successfully registered.");
            passport.authenticate('local')(req, res, function(){
                res.redirect('/campgrounds');
            });
        }
    });
});

router.get('/login', function(req, res){
    res.render('authentication/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: "Welcome !"
}), function(req, res){});

router.get('/logout', function(req, res){
    req.logOut();
    req.flash("success", "Successfully logged out. See you soon ;)");
    res.redirect('/');
});

module.exports = router;