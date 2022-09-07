const mongoose = require('mongoose');

const disconnect = ()=> {
    mongoose.disconnect().then((res)=> {
        console.log("[SUCCESS] Disconnecting from database");
        console.log(res);
    });
};

module.exports = disconnect;