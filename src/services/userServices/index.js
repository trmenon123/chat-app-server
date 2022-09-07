const userSchema = require('../../model/userModel');

// Get User By Email [SERVICES]
const getUserByEmail = async (email)=> {
    const user = await userSchema.findOne({email});
    try {
        if(user){
            return{exist: true, data: user};
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting user by email");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Getting user by id [SERVICES]
const getUserByIdService = async(id)=> {
    try{
        const user = await userSchema.findById(id);
        if(user) {
            return { exist: true, data: user};
        }else {
            return {exist: false, data: {}};
        }
    }catch(err) {
        console.log("[USER-SERVICE-EXCEPTION] Trying to get user by Id");
        return {exist: false, data: {}};
    }
}

// Create New User [SERVICES]
const createNewUser = async (user)=> {
    try {
        const newUser = new userSchema(user);
        await newUser.save((error, user) => {
          if (error) {
              console.log("[ERROR] Creating new user");
              console.log(error);
          }
          return user;
        });
        return newUser;
    }catch (error) {
        console.log("[EXCEPTION] Creating new user");
    }
};

module.exports= {
    getUserByEmail,
    createNewUser,
    getUserByIdService
};