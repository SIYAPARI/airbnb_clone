const express=require("express");;
const router=express.Router();
const wrapasync=require("../util/wrapasync.js");
const Listing=require("../models/listing.js");
const {validateListing,isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router
.route("/")
.get(wrapasync(listingController.index))
// .post(isLoggedIn,validateListing,wrapasync(listingController.createListing));
.post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
})

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
.route("/:id")
.get(wrapasync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapasync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapasync(listingController.destroyListing));

//EDIT
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingController.editListing));


module.exports=router;