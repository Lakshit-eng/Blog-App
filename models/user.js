const mongoose = require("mongoose");
const {createHmac,randomBytes} = require("crypto");   //we will require crypto to use salt to hash user's password 
const { networkInterfaces } = require("os");
const { createTokenForUser } = require("../services/authentication");
const userSchema = new mongoose.Schema({
    fullName :{
        type :String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }, 
    salt:{
      type:String,           //this salt will help us to hash the password
     
    },
    password:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String,
        default:"/images/useravtar.png",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},
{timestamps:true}
);

userSchema.pre("save", function(next){
   const user = this;    //this refers to surrent user

   if(!user.isModified("password")) return;

   const salt = randomBytes(16).toString();    //create a salt with random bytes and it will also be stored in database
   const hashedPassword =createHmac("sha256",salt).update(user.password).digest("hex");   //now hash the password first select which also to use
   // then choose over which key you want to hash it and the after update enter what youn want to update (user.password) and then diguest("hex");
    
   this.salt = salt;      
   this.password = hashedPassword;
   next();   //then call the next function
});

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user = await this.findOne({email});
    if(!user)throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(hashedPassword!==userProvidedPassword)throw new Error("Incorrect Password");
 
        const token = createTokenForUser(user);
        return token;
  
})

const User = mongoose.model("user",userSchema);

module.exports = User;