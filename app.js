const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const Listing = require("./models/listing.js")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js")

app.set("views" , path.join(__dirname,"views"))
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname , "/public")))
app.use(express.urlencoded({ extended:true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);

main().then((res)=>{console.log("connection successful")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderly');
}

const validateSchema = (req,res,next)=>{
let {error} = listingSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errmsg)
  }
  else{
    next();
  }
}

// root route

app.get("/" , (req,res)=>{
    res.send("root route")
})

//Index Route

app.get("/listings" , wrapAsync(async(req ,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}))

//new Route
app.get("/listings/new" , (req,res)=>{
res.render("listings/new.ejs");
})

//create Route

app.post("/listings" , wrapAsync(async (req,res)=>{
    // let {title,description,price,location,country} = req.body;
    // let listing = new Listing({title:title, description:description,image:image,price:price,location:location,country:country})
    //await listing.save()

    let listing = req.body.listing;
    // console.log(listing);
    const newListing = new Listing(listing);
    await newListing.save()
    res.redirect("/listings");
}))

//Show Route
app.get("/listings/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
}))
//edit route
app.get("/listings/:id/edit" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/edit.ejs" , {listing});
}))

//update route
app.put("/listings/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = req.body.listing;
   await Listing.findByIdAndUpdate(id , listing);
     // destructing way
   //    await Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listings/${id}`);
}))

//delete route

app.delete("/listings/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))




//Reviews Post Route


app.post("/listings/:id/reviews" , async(req,res)=>{
    let  { id}  = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    res.send("new review added ");



})



app.use((req,res,next)=>{
     next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{

    let { statusCode = 500 , message = "something went wrong" } = err; 
    res.status(statusCode).render("error.ejs",{message})
})
app.listen(8080,()=>{
    console.log("server is listning on 8080")
})