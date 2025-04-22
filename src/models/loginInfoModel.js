const mongoose = require("mongoose");

const loginInfoSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    plainPassword: { type: String, required: true }, // mật khẩu gốc để giao cho người mua
    type: { type: String, required: true }, // Loại tài khoản (Facebook, Garena, Apple, v.v.)
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoginInfo", loginInfoSchema);
