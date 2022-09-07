const { expressjwt: jwt } = require("express-jwt");
const config = require('config');

const requireSignin= jwt({
    secret: config.get("jwt.secret"),
    algorithms: ["HS256"], // added later
    userProperty: "user",
});

module.exports= {
    requireSignin
}