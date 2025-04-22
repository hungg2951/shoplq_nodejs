const mongoose = require("mongoose");

const coinHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true }, // số coin nạp
    method: { type: String, default: "ADMIN" }, // ví dụ: MOMO / CARD / ADMIN
    description: { type: String }, // ghi chú thêm
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoinHistory", coinHistorySchema);
