var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
//Connect to server
mongoose.connect('mongodb://localhost:27017/yelp_camp_v12');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//seedDB();    //Seed the database

//passward configuration
app.use(require("express-session")({
    secret:"Nevermore",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//User.authenticate comes with the "UserSchema.plugin(passportLocalMongoose)" method
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Adding "currentUser" to all routes to determine whether to show login/logout nav bar
app.use(function(req,res,next){
    res.locals.currentUser = req.user; //Add middleware
    res.locals.error = req.flash("error"); //Add flash error to global message
    res.locals.success = req.flash("success");
    next(); //Need to have next() to move on the the next route 
})

//requring routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp has Started!") 
});