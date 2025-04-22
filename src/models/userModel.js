const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default:
        "https://phanmemmkt.vn/wp-content/uploads/2024/09/Hinh-anh-dai-dien-mac-dinh-Facebook.jpg",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    coin: { type: Number, default: 0 },
    status: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: Number,
    verificationCodeExpires: Date,
  },
  { timestamps: true }
);
// Tự động hash password nếu bị thay đổi
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// So sánh password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", userSchema);
