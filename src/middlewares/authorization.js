const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Nếu bạn lưu thông tin quyền trong model User

// Middleware kiểm tra quyền
const checkPermission = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Lấy token từ header (Bearer token)
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res
          .status(401)
          .json({ message: "Access denied. No token provided." });
      }

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy người dùng từ database (hoặc có thể chỉ cần thông tin từ token)
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User không tồn tại!" });
      }

      // Kiểm tra quyền (role)
      if (user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập!" });
      }

      // Nếu pass kiểm tra quyền, gán thông tin người dùng vào request để sử dụng trong controller
      req.user = user;
      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid token." });
    }
  };
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // kiểm tra token
    req.user = decoded; //GÁN decoded vào req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token sai hoặc hết hạn" });
  }
};
module.exports = { checkPermission, authMiddleware };
