
const mongoose = require("mongoose");

const FundsTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["ADD", "WITHDRAW"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FundsTransactionModel = mongoose.model(
  "FundsTransaction",
  FundsTransactionSchema
);

module.exports = { FundsTransactionModel };
