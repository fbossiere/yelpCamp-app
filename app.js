const   express                 = require('express'),
        bodyParser              = require('body-parser'),
        mongoose                = require("mongoose"),
        passport                = require('passport'),
        methodOverride          = require("method-override"),
        cookieParser            = require('cookie-parser'),
        LocalStrategy           = require("passport-local").Strategy,
        passportLocalMongoose   = require("passport-local-mongoose"),
        User                    = require("./models/user"),
        seedDB                  = require("./seeds"),
        path                    = require('path');

const commentRoutes             = require("./routes/comments"),
      campgroundRoutes          = require("./routes/campgrounds"),
      authRoutes                = require("./routes/index");


mongoose.connect('mongodb://localhost/yelpcamp_app');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
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
});
app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//SEEDING DB
seedDB();


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is listening!")
});
