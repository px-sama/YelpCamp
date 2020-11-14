var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

//INDEX ROUTE - Show all campgrounds
router.get("/", function(req,res){
        // res.render("campgrounds", {campgrounds:campgrounds});
        //get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
            if (err){
                console.log(err);
            }else{
                res.render("campgrounds/index", {campgrounds:allCampgrounds});
            }
        });
});

//CREAT -  "Add Campground function" to the DB
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err,newlyCreated){
       if (err){
           console.log(err);
       } else{
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
    });  
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW - more info about the one campgrounds
router.get("/:id", function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {
       if(err || !foundCampground){
           req.flash("error", "Campground not found!");
           res.redirect("back")
       } else{
           console.log(foundCampground);
           //render SHOW template with that campground
           res.render("campgrounds/show", {campground:foundCampground});
       }
    });
     
});

//Edit Campground Route
//pass in campground id
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

//Update Campground Route
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updateCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;