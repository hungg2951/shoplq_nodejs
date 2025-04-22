const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Nếu bạn lưu thông tin quyền trong model User

// Middleware kiểm tra quyền
const checkPermission = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User không tồn tại" });

      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập!" });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(400).json({ message: "Token không hợp lệ" });
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
