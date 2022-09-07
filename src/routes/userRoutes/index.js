const express = require('express');
const router = express.Router();
const { userController } = require('../../controller');
const { requireSignin } = require('../../middleware');

// Create New User
router.post("/signup", userController.createUser);

// User Signin
router.post("/signin", userController.signin);

// User Signout
router.get("/signout", userController.signout);

// Profile Card
router.get("/profileCard/:id", requireSignin, userController.profileCardController);

module.exports = router;