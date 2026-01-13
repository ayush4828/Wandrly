const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({


    title:{
        type:String,
        required : true
    } ,

    description : String,
    
    
    image : {
    type:String,
    default:"sandbox:/mnt/data/A_high-resolution_photograph_captures_Positano,a.png",
    set : (v) => 
        v === "" 
             ? "sandbox:/mnt/data/A_high-resolution_photograph_captures_Positano,a.png" 
             : v

    } ,

    price : Number,
    location : String,
    country : String


})

const Listing = new mongoose.model("Listing" , listingSchema)

module.exports = Listing;