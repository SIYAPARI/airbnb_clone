const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../util/wrapasync.js");
const ExpressError=require("../util/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");


//POST review
router.post("/",isLoggedIn,validateReview,wrapasync(async(req,res)=>{
    console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author=req.user._id;

    await newReview.save();
    await listing.save();
    console.log("saved review");
    req.flash("success","New Review Added !");
    res.redirect(`/listing/${listing.id}`);
     
}))

//Delete REVIEW Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(async(req,res)=>{
    let {id , reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted !");
    res.redirect(`/listing/${id}`);
} ),)

module.exports=router;