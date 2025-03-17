const express=require("express");;
const router=express.Router();
const wrapasync=require("../util/wrapasync.js");

const Listing=require("../models/listing.js");
const {validateListing,isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
//INDEX ROUTE
router.get("/",wrapasync(listingController.index));


//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);


//SHOW ROUTE
router.get("/:id",wrapasync,listingController.showListing);

// CREATE ROUTE
router.post("/",isLoggedIn,validateListing,wrapasync,listingController.createListing);

//EDIT
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync,listingController.editListing);
//update
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapasync,listingController.updateListing)

//delete
router.delete("/:id",isLoggedIn,isOwner,wrapasync,listingController.destroyListing);

module.exports=router;