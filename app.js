require("dotenv").config();

const path = require("path");
const express = require("express");
const userRoute = require("./routers/user");
const blogRoute = require("./routers/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog= require("./models/blog");


const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then(e=>console.log("mongodb connected at port",PORT));
//middlewares

app.set("view engine","ejs");    //set view engine
app.set("views",path.resolve("./views"));    //set path for views
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

//routes

app.get("/",async(req,res)=>{
    
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs:allBlogs,
    });
});

app.use("/user",userRoute);
app.use("/blog",blogRoute);


app.listen(PORT,(req,res)=>{`server is connected to port:${PORT} `});
 