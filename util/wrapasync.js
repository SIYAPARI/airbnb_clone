const asyncwrap=function wrapasync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err => {
            console.error("Async Error:", err);
            next(err);
        });
    }
}

module.exports=asyncwrap;