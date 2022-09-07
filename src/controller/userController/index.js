const { userServices, themeServices }= require('../../services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');


// Create User [CONTROLLER]
const createUser = async (req,res)=> {
    const userQuery = await userServices.getUserByEmail(req?.body?.email);
    try{
        if(userQuery?.exist== true) {
            res.status(200).json({
                success: false, 
                message:"User already Exist", 
                data: userQuery?.data
            });            
        }
        if(userQuery?.exist== false) {
            // Call to create new user            
            const data = {...req.body};            
            const newUser = await userServices.createNewUser(data);
            res.status(200).json({
                success: true, 
                message: "New user created", 
                data: newUser
            });
        }
    }catch(err){
        res.status(200).json({
            success: false, 
            message: "Call not acheived", 
            data: {}
        });
    }
};

// User Signin [CONTROLLER]
const signin = async(req, res)=> {
    const userQuery = await userServices.getUserByEmail(req.body?.email);
    try{
        if(userQuery?.exist== false) {
            res.status(200).json({
                success: false, 
                message: "User not registered", 
                data: {}
            });
        }
        if(userQuery?.exist== true) {
            // Getting encrypted password 
            const validpassword = await bcrypt.compare(
                req.body?.password,
                userQuery?.data?.password
            );
            if(validpassword) {
                // JWT Authentication
                const secret = config.get("jwt.secret");
                const token = jwt.sign(
                    {_id: userQuery?.data._id},
                    secret,
                    {expiresIn: '1d'}
                );
                res.cookie('token', token, {expiresIn:'1d'});
                res.status(200).json({
                    success: true, 
                    message: "Signin success", 
                    data: userQuery?.data, 
                    token
                });
            }else {
                res.status(200).json({
                    success: false, 
                    message: "Incorrect Password", 
                    data: {}
                });
            }                  
        }
    }catch(err){
        console.log("[ERROR] User Signin terminated");
        console.log(err);   
        res.status(200).json({
            success: false, 
            message: "API failed", 
            data: {}
        });     
    }
};

// User Signout [CONTROLLER]
const signout = (req, res)=> {
    res.clearCookie('token');
    res.json({
        success: true,
        message: "Signout success"
    });
};

// User Profile Card Fetch [CONTROLLER]
const profileCardController = async (req, res)=> {
    try {
        if(req?.params?.id) {
            const user = await userServices.getUserByIdService(req?.params?.id);
            if(user?.exist === false) {
                res.status(200).json({
                    success: false, 
                    message: "User does not exist", 
                    data: {}
                });
            }
            if(user?.exist === true) {
                res.status(200).json({
                    success: true, 
                    message: "User Prifile archived", 
                    data: {
                        name: `${user?.data?.firstName} ${user?.data?.lastName}`,
                        email: user?.data?.email,
                        joined: user?.data?.createdAt
                    }
                });
            }
        }else {
            res.status(200).json({
                success: false, 
                message: "User Id not requested", 
                data: {}
            }); 
        }        
    }catch(err) {
        console.log("[ERROR] User Profile Card Fetch");
        console.log(err);   
        res.status(200).json({
            success: false, 
            message: "API failed", 
            data: {}
        });    
    }
    
}

module.exports= {
    createUser,
    signin,
    signout,
    profileCardController
}