const Listing=require("../models/listing")

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports.index=async (req,res)=>{
    const query = req.query.q;
    let allListings;
    if (query) {
        const escapedQuery = escapeRegex(query);
        allListings = await Listing.find({
            $or: [
                { title: { $regex: escapedQuery, $options: 'i' } },
                { location: { $regex: escapedQuery, $options: 'i' } },
                { country: { $regex: escapedQuery, $options: 'i' } },
                { description: { $regex: escapedQuery, $options: 'i' } }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }
    console.log(allListings);
    res.render("./listings/index.ejs", { allListings, q: query });
}

module.exports.apiIndex = async (req, res) => {
    try {
        const query = req.query.q;
        let allListings;
        if (query) {
            const escapedQuery = escapeRegex(query);
            allListings = await Listing.find({
                $or: [
                    { title: { $regex: escapedQuery, $options: 'i' } },
                    { location: { $regex: escapedQuery, $options: 'i' } },
                    { country: { $regex: escapedQuery, $options: 'i' } },
                    { description: { $regex: escapedQuery, $options: 'i' } }
                ]
            });
        } else {
            allListings = await Listing.find({});
        }
        res.json(allListings);
    } catch (error) {
        console.error('Error in apiIndex:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
        }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist");
        res.redirect("/listing")
    }
    // console.log(listing);
    res.render("./listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.tax = Math.floor(Math.random() * 16) + 10; // Random tax 10-25%
    console.log('Generated tax:', newListing.tax);
    await newListing.save();
    console.log("new created");
    req.flash("success","New Listing Created !");
    res.redirect("/listing");
    
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist");
        res.redirect("/listing")
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("./listings/Edit.ejs",{listing,originalImageUrl})
};

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid data for listing");
    }
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        Listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated !");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted !");
    res.redirect("/listing");
};