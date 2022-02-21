// import the cart model
const { json } = require("express/lib/response");
const CartItem = require("../models/CartItemModel");

// get the current user's cart
const getCart = async (req, res) => {
  try {
    const cart = await CartItem.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({
      cart: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// add a new product to cart
const addToCart = async (req, res) => {
  try {
    const newCartItem = new CartItem({
      user: req.user._id,
      name: req.body.name,
      price: req.body.price,
      quantity: 1,
    });

    // save the new cart to the database
    await newCartItem.save();

    return res.json(newCartItem);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// increase quantity of products in the cart
const incQuantity = async (req, res) => {
  try {
    // get the product to be updated
    const updatedCartItem = await CartItem.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.cartId,
      },
      { $inc: { quantity: 1 } },
      {
        new: true,
      }
    );

    return res.json(updatedCartItem);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// decrease quantity of products in the cart
const decQuantity = async (req, res) => {
  try {
    // get the product to be updated
    const updatedCartItem = await CartItem.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.cartId,
      },
      { $inc: { quantity: -1 } },
      {
        new: true,
      }
    );

    return res.json(updatedCartItem);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// delete aproduct from the cart
const deleteProduct = async (req, res) => {
  try {
    // get the product to be deleted by the id
    await CartItem.findOneAndRemove({
      user: req.user._id,
      _id: req.params.cartId,
    });

    return res.status(200).json({ sucess: true });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  getCart,
  addToCart,
  incQuantity,
  decQuantity,
  deleteProduct,
};
