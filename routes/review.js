const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")


const validateReview = (req,res,next)=>{
let {error} = reviewSchema.validate(req.body);

// if (!req.body.comment.trim()) {
//    throw new Error("Comment cannot be empty");
// }
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errmsg)
  }
  else{
    next();
  }
}


//Reviews Post Route


router.post("/"  , validateReview  ,  wrapAsync(async(req,res)=>{
    let  { id}  = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

   
    await listing.save();
    await newReview.save();
 req.flash("success","New Review Added !! ")
   res.redirect(`/listings/${id}`);
}))


//Reviews delete Route

router.delete("/:reviewId" , wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
     req.flash("success"," Review Deleted !! ")
    res.redirect(`/listings/${id}`);
}))




module.exports = router;