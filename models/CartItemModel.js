// require all the necessary packages...
const { Schema, model } = require("mongoose");

// cart model
const CartItemSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const CartItem = model("CartItem", CartItemSchema);

// Export the model
module.exports = CartItem;
