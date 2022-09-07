const mongoose = require('mongoose');
const config = require('config');

const connect = ()=> {
    try {
        const url = config.get("database");
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return mongoose.connection;
    }catch(error){
        console.log("[ERROR] Database Connection");
        console.log(error);
        process.exit(0);
    }
}

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("[WARNING] disconnecting due to application termination...");
      process.exit(1);
    });
});

module.exports= connect;