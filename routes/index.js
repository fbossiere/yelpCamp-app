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
            res.redirect('/register');
        } else {
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
    failureRedirect: '/login'
}), function(req, res){});

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

module.exports = router;