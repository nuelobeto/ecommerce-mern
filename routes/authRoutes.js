const express = require("express");

const router = express.Router();

// import controllers
const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} = require("../controllers/AuthControllers");

// Import protected routes
const requiresAuth = require("../middleware/permissions");

// @route    POST /api/auth/register
// @desc     Create a new user
// @access   Public
router.post("/register", registerUser);

// @route    POST /api/auth/login
// @desc     Login user and return an access token
// @access   Public
router.post("/login", loginUser);

// @route    GET /api/auth/current
// @desc     Return the currently authed user
// @access   Private
router.get("/current", requiresAuth, currentUser);

// @route    PUT /api/auth/logout
// @desc     Logout user and clear the cookie
// @access   Private
router.put("/logout", requiresAuth, logoutUser);

module.exports = router;
