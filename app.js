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

//Index Route

app.get("/listings" , async(req ,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
})

//new Route
app.get("/listings/new" , (req,res)=>{
res.render("listings/new.ejs");
})

//create Route

app.post("/listings" , async (req,res)=>{
    // let {title,description,price,location,country} = req.body;
    // let listing = new Listing({title:title, description:description,image:image,price:price,location:location,country:country})
    //await listing.save()
    let listing = req.body.listing;;
    // console.log(listing);
    const newListing = new Listing(listing);
    await newListing.save()
    res.redirect("/listings");
})

//Show Route
app.get("/listings/:id" , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
})

//edit route
app.get("/listings/:id/edit" , async (req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/edit.ejs" , {listing});
})



app.listen(8080,()=>{
    console.log("server is listning on 8080")
})