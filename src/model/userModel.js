const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const {Schema}= mongoose;

const UserSchema= new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true});

UserSchema.pre("save", async function(next){
    try{
        const rounds= config.get("crypt.rounds");
        const salt = await bcrypt.genSalt(rounds);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }catch(err){
        console.log("[ERROR] Password Hashing failed");
        console.log(err);
        next();
    }
});

module.exports = mongoose.model("User", UserSchema);