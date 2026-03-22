const Listing = require("../models/listing")
const {cloudinary} = require("../cloudConfig")

async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "WandrlyApp/1.0"
            }
        });
        const data = await response.json();
        if (data.length > 0) {
            return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        }
    } catch (err) {
        console.log("Geocoding Error:", err);
    }
    // Default fallback coordinates if location not found
    return [0, 0];
}

module.exports.index=async(req ,res)=>{
    const {category, search} = req.query;
    let filter = {}
    if(category){
        filter.category = category;
    }
    if(search){
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
            { title:       { $regex: escapedSearch, $options: "i" } },
            { location:    { $regex: escapedSearch, $options: "i" } },
            { description: { $regex: escapedSearch, $options: "i" } },
        ];
    }
     
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs" , {allListings,selectedCategory : category});
}

module.exports.renderNewForm = (req,res)=>{
res.render("listings/new.ejs");
}

module.exports.createForm = async (req,res)=>{
    // let {title,description,price,location,country} = req.body;
    // let listing = new Listing({title:title, description:description,image:image,price:price,location:location,country:country})
    //await listing.save()
    let url = req.file.path || req.file.secure_url || req.file.url;
    let filename = req.file.filename || req.file.public_id;

    let listing = req.body.listing;
    // console.log(listing);
    const newListing = new Listing(listing);
    
    const coordinates = await geocode(listing.location);
    newListing.geometry = {
        type: "Point",
        coordinates: coordinates
    };

    newListing.owner = req.user._id
    newListing.image = {url,filename}
    
    await newListing.save();

    req.flash("success","New Listing Created !! ")

    res.redirect("/listings");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate: { path:"author",}}).populate("owner");
    if(!listing){
          req.flash("error","Listing  you  requested  for  is  does  not  exist !! ")
           return res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing})
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
      if(!listing){
          req.flash("error","Listing  you  requested  for  is  does  not  exist !! ")
           return res.redirect("/listings")
    }
   res.render("listings/edit.ejs" , {listing });
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = req.body.listing;

    const coordinates = await geocode(listing.location);
    listing.geometry = {
      type: "Point",
      coordinates: coordinates
    };
    
 let listing1 =  await Listing.findByIdAndUpdate(id , listing);


 if(typeof req.file !== "undefined"){
    let url = req.file.path || req.file.secure_url || req.file.url;
    let filename = req.file.filename || req.file.public_id;
    listing1.image = {url,filename}

    await listing1.save();
    }
     // destructing way
   //    await Listing.findByIdAndUpdate(id , {...req.body.listing});
   req.flash("success","Listing Updated !! ")
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing.image && listing.image.filename){
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !! ")
    res.redirect("/listings");
}