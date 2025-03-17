const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
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
     
}

module.exports.destroyReview=async(req,res)=>{
    let {id , reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted !");
    res.redirect(`/listing/${id}`);
}