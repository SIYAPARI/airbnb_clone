const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../util/wrapasync.js");
const ExpressError=require("../util/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//POST review
router.post("/",isLoggedIn,validateReview,wrapasync(reviewController.createReview))

//Delete REVIEW Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(reviewController.destroyReview ),)

module.exports=router;