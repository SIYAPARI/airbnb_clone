const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./util/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        //Storing info only if user wasn't logged in 
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();

};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing ");
    return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body, { abortEarly: false });
    
    console.log("Request Body:", JSON.stringify(req.body, null, 2));

    if (error) {
        console.log("Validation Errors:", error.details);
        return next(new ExpressError(400, error.details.map(err => err.message).join(", ")));
    }
    
    console.log("Validation Passed");
    next();
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        console.log("Validation error in review ");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review ");
    return res.redirect(`/listing/${id}`);
    }
    next();
};