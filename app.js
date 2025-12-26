//search functionality in backend
//make the menu  buttons working , that is it displays , the pool , farms etc listing ,on the basis of selected 

if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./util/ExpressError.js");
const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const { error } = require('console');

app.use(express.json());  
app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname,"views")));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
let port=3001;
const dburl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
    
});
store.on("error",()=>{
    console.log("Error in mongo store ",error);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success") || null;
    res.locals.error = req.flash("error") || null;
    res.locals.currUser=req.user;
    next();
});

app.use("/listing",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

async function main() {
    await mongoose.connect(dburl);
}
main().then(()=>{
    console.log("DB connected");
})
.catch((e)=>{
    console.log("ERROR",e);
});
// let mongourl="mongodb://127.0.0.1:27017/wanderlust"

    
app.listen(port,()=>{
    console.log('listening to the port',port);
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"))
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message='Something went wrong'}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
});
