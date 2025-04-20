const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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
    // Tạo mới người dùng
    const newUser = new User({
      username,
      email,
      password,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();
    res.status(201).json({ message: "Đăng ký tài khoản thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Hàm đăng nhập (Login)
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm người dùng theo username hoặc email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) {
      return res.status(400).json({ message: "Tên người dùng hoặc email không tồn tại" });
    }

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

module.exports = { login, register };
