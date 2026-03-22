if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const Session = require("express-session")
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash")

const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("views" , path.join(__dirname,"views"))
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname , "/public")))
app.use(express.urlencoded({ extended:true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
const dbUrl=process.env.ATLASDB_URL
main().then((res)=>{console.log("connection successful")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecret"
    },
    touchAfter:24*3600
})

store.on("error" , (err)=>{
    console.log("error in mongo store " , err)
})


const sessionOptions = {secret:process.env.SESSION_SECRET, store,
    resave:false ,
     saveUninitialized:true ,
    cookie:{
        expires : Date.now() + 14*24*60*60*1000,
        maxAge : 14*24*60*60*1000,
        httpOnly:true 

    }}


app.use(Session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

// 

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)





app.use((req,res,next)=>{
     next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{

    let { statusCode = 500 , message = "something went wrong" } = err; 
    res.status(statusCode).render("error.ejs",{message})
})
app.listen(8085,()=>{
    console.log("server is listning on 8085")
})