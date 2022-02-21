const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import the user model
const User = require("../models/UserModel");

// Import validation functions
const validateRegisterInput = require("../validation/registerValidation");

// register user controller func
const registerUser = async (req, res) => {
  try {
    // run input fields validations
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // get the register parameters
    const { name, email, password } = req.body;

    // check that the user does not exist in the database
    const existingUser = await User.findOne({
      email: new RegExp("^" + email + "$", "i"),
    });

    // if there is already a user with that email, throw an error
    if (existingUser) {
      return res.status(400).json({
        error: "There is already a user with this email",
      });
    }

    // hash the new user password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create a new user with the user model
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // save the new user to the database
    const savedUser = await newUser.save();

    // create a token
    const payload = { userId: savedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const userToReturn = { ...savedUser._doc };
    delete userToReturn.password;

    // return the new user
    return res.json(userToReturn);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// login user controller func
const loginUser = async (req, res) => {
  try {
    // get the login parameters
    const { email, password } = req.body;

    // check that the user exists before they can login
    const user = await User.findOne({
      email: new RegExp("^" + email + "$", "i"),
    });

    // if there is no user, throw an error
    if (!user) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }

    // confirm that the password of the person trying to log in matches that of the user in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // if the the passwords do not match, throw an error
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }

    // if login was succesful, create a token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    return res.json({
      token: token,
      user: userToReturn,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// get the current user controller func
const currentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(req.user);
};

// logout controller func
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("access-token");

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.status(500).send(error.message);
  }
};

module.exports = { registerUser, loginUser, currentUser, logoutUser };
