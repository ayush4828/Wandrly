const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js")




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


//Index Route

router.get("/" , wrapAsync(async(req ,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}))

//new Route
router.get("/new" , (req,res)=>{
res.render("listings/new.ejs");
})

//create Route

router.post("/" , wrapAsync(async (req,res)=>{
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
router.get("/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing})
}))
//edit route
router.get("/:id/edit" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/edit.ejs" , {listing});
}))

//update route
router.put("/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = req.body.listing;
   await Listing.findByIdAndUpdate(id , listing);
     // destructing way
   //    await Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listings/${id}`);
}))

//delete route

router.delete("/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))


module.exports = router;