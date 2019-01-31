
var mongoose = require("mongoose");

var Campground = require("./models/campground");

var Comment = require("./models/comment");

var data = [
    {name: "Camp Night", 
    image: "https://pixabay.com/get/e83db80d2cfd053ed1584d05fb1d4e97e07ee3d21cac104496f8c27aafedb1b9_340.jpg",
    description: "Awesome"
    },
    {name: "Iceland", 
    image: "https://pixabay.com/get/ea31b10929f7063ed1584d05fb1d4e97e07ee3d21cac104496f8c27aafedb1b9_340.jpg",
    description: "Awesome"
    },
    {name: "Camp & Guitar", 
    image: "https://farm2.staticflickr.com/1922/29948726957_fe29e986d9.jpg",
    description: "Awesome"
    }
] 

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        }else{
        console.log("Removed Campgrounds");
        }
    });
    //Add a few campgrounds

    data.forEach(function(seed){
        Campground.create(seed, function(err,campground){
            if (err){
                console.log(err)
            }else{
                console.log("Added a Campground!")
                //Create a comment
                Comment.create(
                    {
                        text: "This is a great place",
                        author: "Homer"
                    }, function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment")
                        }
                        
                });
            }
        });
    }); 
    

}

module.exports = seedDB;

