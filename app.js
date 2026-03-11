const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const Session = require("express-session")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js");

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



const sessionOptions = {secret:"mysupersecretcodestring" , 
    resave:false ,
     saveUninitialized:true ,
    cookie:{
        expires : Date.now() + 14*24*60*60*1000,
        maxAge : 14*24*60*60*1000,
        httpOnly:true 

    }}

app.use(Session(sessionOptions))


// root route
app.get("/" , (req,res)=>{
    res.send("root route")
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)





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