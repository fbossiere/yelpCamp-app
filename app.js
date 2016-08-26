var express = require('express'),
bodyParser = require('body-parser'),
mongoose = require("mongoose"),
Campground = require("./models/campground"),
Comment = require("./models/comment"),
passport = require('passport'),
cookieParser = require('cookie-parser'),
LocalStrategy = require("passport-local").Strategy,
passportLocalMongoose = require("passport-local-mongoose"),
User = require("./models/user"),
seedDB = require("./seeds");
const path = require('path');
require('mongoose-type-url');


mongoose.connect('mongodb://localhost/yelpcamp_app');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(require("express-session")({
    secret: 'Rusty is the best and cutest dog in the world',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//SEEDING DB
seedDB();

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
            console.log('Found campgrounds');
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
                currentUser: req.user
            });
        }
    });

});

app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
});

app.post("/campgrounds", function(req, res) {
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

app.get('/campgrounds/:id', function(req, res) {
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

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log('Could not find campground with id ' + req.params.id);
        } else{
            console.log('Successfully found campground with id ' + req.params.id);
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
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

app.get('/register', function(req, res){
    res.render('authentication/register');
});

app.post('/register', function(req, res){
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

app.get('/login', function(req, res){
    res.render('authentication/login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){});

app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is listening!")
});
