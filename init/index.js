const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>{
    console.log("DB connected");
})
.catch((e)=>{
    console.log("ERROR",e);
});
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB =async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"67d487275fa55531be5cbecd"
    }))
    await Listing.insertMany(initData.data);
    console.log("data initialised");
};
initDB();