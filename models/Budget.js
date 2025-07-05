const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "💸",
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String, // Format: YYYY-MM
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
