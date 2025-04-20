const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("./sendMail");

// Hàm đăng ký (Register)
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Tên người dùng tồn tại" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email đã có người đăng ký" });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // Tạo mới người dùng
    const newUser = new User({
      username,
      email,
      password,
      verificationCode,
      verificationCodeExpires: Date.now() + 2 * 60 * 1000, // 2 phút
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({
      message:
        "Đăng ký tài khoản thành công, Vui kiểm tra Email của bạn để kích hoạt tài khoản!",
      email: email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Không tìm thấy người dùng" });
  if (user.isVerified)
    return res.json({ message: "Tài khoản này đã được kích hoạt" });
  if (user.verificationCode !== code)
    return res.status(400).json({ message: "Mã không chính xác" });
  if (user.verificationCodeExpires < Date.now())
    return res
      .status(400)
      .json({ message: "Mã đã hết hạn vui lòng lấy mã mới" });

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  res.json({ message: "Kích hoạt tài khoản thành công!" });
};
// Hàm đăng nhập (Login)
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm người dùng theo username hoặc email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Tên người dùng hoặc email không tồn tại" });
    }
    if (!user.isVerified)
      return res.status(400).json({ message: "Vui lòng xác thực tài khoản" });
    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Tạo JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN, // Thời gian hết hạn của token
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json(user);
  } catch (err) {
    console.error("Lỗi lấy user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
module.exports = { login, register, getMe, verifyEmail };
