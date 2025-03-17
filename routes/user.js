const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync=require("../util/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapasync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","user registered successfully");
            res.redirect("/listing");
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    (async(req,res)=>{
        req.flash("sucess","Welcome Back to Wanderlust"); //NOT FLASHING
        let redirectUrl=res.locals.redirectUrl || "/listing";

        res.redirect(redirectUrl);
}))

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Now");
        res.redirect("/listing");
    })
})
module.exports=router;