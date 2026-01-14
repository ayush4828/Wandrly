const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const Listing = require("./models/listing.js")

app.set("views" , path.join(__dirname,"views"))
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname , "public")))
app.use(express.urlencoded({ extended:true }))
app.use(methodOverride('_method'))


main().then((res)=>{console.log("connection successful")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderly');
}

// app.get("/",(req,res)=>{
//     res.send("woking ")
// })

// app.get("/testlistings" , async (req,res)=>{
//     const newListing = new Listing({
//         title:"snow fall ",
//         description : "it's a best place to visit",
//         price:6000,
//         location:"masoori",
//         country:"India"

//     })

//     await newListing.save()

//     res.send("successfully Work")

// })



//Index Route

app.get("/listings" , async(req ,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
})

//Show Route
app.get("/listings/:id" , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
})
app.listen(8080,()=>{
    console.log("server is listning on 8080")
})