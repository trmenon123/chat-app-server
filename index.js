const express = require('express');
const config = require('config');
const cors = require('cors');
const {connect, disconnect} = require('./database');
const router = require('./src/routes');


// Globals
global.__basedir = __dirname;

// PORT
const PORT = config.get("server.port") || 8000;

// APP
const app= express();
app.use(express.json());

// CORS
app.use(cors());

// Enable JSON
app.use(express.json());

// Database Connection
connect()
    .on("error", (err)=> {
        console.log("[ERROR] Can not connect to database");
        console.log(err);
    })
    .once("open", ()=> {
        console.log("[SUCCESS] Connection to database established");
    });

app.use((req,res,next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routing
app.use("/api/v1/user", router.userRouter);

// HTTP SERVER
const httpServer = app.listen(PORT, (err)=> {
    if(err) {
        console.log("[ERROR] Unable to listen to any port");
    }else {
        console.log("[SUCCESS] Server started and listening to port:"+PORT);
    }
})

// HANDLING 404
app.use("/", (req, res)=> {
    res.json({error: 404, message: "Server not found"});
});