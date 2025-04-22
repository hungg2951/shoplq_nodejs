const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    price: { type: Number, required: true }, // giá tại thời điểm mua
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseHistory", purchaseHistorySchema);
