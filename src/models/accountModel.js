const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    //  Mã acc + thông tin cơ bản
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[a-zA-Z0-9]+$/, // Chỉ chữ và số, không ký tự đặc biệt
    },
    description: { type: String }, // Mô tả chi tiết
    game: { type: String, default: "Liên Quân" }, // Tên game

    //  Giá cả
    price: { type: Number, required: true }, // Giá gốc
    discount: { type: Number, default: 0 }, // Giảm giá %

    // Trạng thái bán
    isSold: { type: Boolean, default: false }, // Đã bán hay chưa
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người mua

    //  Thông tin đăng nhập
    loginInfo: { type: mongoose.Schema.Types.ObjectId, ref: "LoginInfo" },

    //  Thông số acc
    rank: { type: String }, // Rank hiện tại (VD: Bạch Kim 1)
    highestRank: { type: String }, // Rank cao nhất từng đạt (VD: Cao Thủ)
    champions: { type: Number }, // Số tướng
    skins: { type: Number }, // Số skin
    runes: { type: Number }, // Ngọc cấp III
    winRate: { type: Number, min: 0, max: 100 }, // Tỷ lệ thắng (VD: 53%)
    renameCards: { type: Number }, // Số thẻ đổi tên
    gold: { type: Number }, // Lượng vàng (VD: 36K)
    matches: { type: Number }, // Số trận đã chơi
    reputation: { type: Number, min: 0, max: 100 }, // Uy tín
    impressions: { type: Number }, // Dấu ấn

    // Hình ảnh
    image: { type: String, required: true }, // Ảnh thumbnail chính
    bagImages: [{ type: String }], // Ảnh túi đồ
    skinImages: [{ type: String }], // Ảnh trang phục
    champImages: [{ type: String }], // Ảnh tướng
    runeImages: [{ type: String }], // Ảnh ngọc

    //  Ghi chú khác
    note: { type: String },
  },
  { timestamps: true } // Tự động tạo createdAt / updatedAt
);

module.exports = mongoose.model("Account", accountSchema);
