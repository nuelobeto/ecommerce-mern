const express = require("express");

const router = express.Router();

// import cart controllers
const {
  getCart,
  addToCart,
  updateQuantity,
  deleteProduct,
  incQuantity,
  decQuantity,
} = require("../controllers/CartControllers");

const requiresAuth = require("../middleware/permissions");

// @route    GET /api/cart/current
// @desc     Get current user's cart
// @access   Private
router.get("/current", requiresAuth, getCart);

// @route    POST /api/cart/new
// @desc     Add a new product to cart
// @access   Private
router.post("/new", requiresAuth, addToCart);

// @route    PUT /api/cart/:cartId/increase
// @desc     Increase quantity of a product in cart
// @access   Private
router.put("/:cartId/increase", requiresAuth, incQuantity);

// @route    PUT /api/cart/:cartId/decrease
// @desc     Decrease quantity of a product in cart
// @access   Private
router.put("/:cartId/decrease", requiresAuth, decQuantity);

// @route    DELETE /api/cart/:cartId/delete
// @desc     Delete a product in cart
// @access   Private
router.delete("/:cartId/delete", requiresAuth, deleteProduct);

module.exports = router;
