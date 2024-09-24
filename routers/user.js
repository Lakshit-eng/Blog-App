const{Router} = require("express");
const User = require("../models/user");               //models se user model ko import krenge
const router = Router();


router.get("/signin",(req,res)=>{               // this route will render signin page for us
    res.render("signin");
})

router.get("/signup",(req,res)=>{              // this route will render signup page for us
    res.render("signup");
})


router.post("/signin",async(req,res)=>{
    const{email,password} = req.body;  
    try{
      //yha se user ka email and password lenge

    const token = await User.matchPasswordAndGenerateToken(email,password);   // yha pe hum us function ko use krenge jo hmne user model imai bnaya password check krne k liye
   
    return res.cookie("token",token).redirect("/");
 }catch(error){
    return res.render("signin",{
        error:"Invalid Email or password",
    });
 }
})
                                                   
router.post("/signup",async(req,res)=>{          // now this page will return us values and we will create a user after insering these values in user model
    const{ fullName,email,password }= req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect("/");
});

router.get("/logout",(req,res)=>{
   res.clearCookie("token").redirect("/");
});



module.exports = router;