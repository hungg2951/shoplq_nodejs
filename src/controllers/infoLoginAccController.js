const Account = require("../models/accountModel");
// Lấy danh sách tất cả tài khoản
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate("loginInfo"); // Lấy tất cả tài khoản và thông tin đăng nhập
    res.status(200).json({ message: "Danh sách tài khoản", accounts });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tài khoản",
      error: error.message,
    });
  }
};

exports.getLoginInfoById = async (req, res) => {
  console.log(req.params);
  
  try {
    const { code } = req.params;

    const account = await Account.findOne({ code })
      .populate("loginInfo");

    if (!account || !account.loginInfo) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin đăng nhập" });
    }

    res.status(200).json({
      message: "Lấy thông tin đăng nhập thành công",
      loginInfo: account.loginInfo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy thông tin đăng nhập",
      error: error.message,
    });
  }
};

exports.updateLoginInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, plainPassword, type } = req.body;

    // Tìm acc theo code
    const account = await Account.findOne({ _id:id }).populate("loginInfo");
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    // Cập nhật login info
    const loginInfo = account.loginInfo;
    if (!loginInfo) {
      return res
        .status(404)
        .json({ message: "Không có thông tin đăng nhập để cập nhật!" });
    }

    if (username) loginInfo.username = username;
    if (plainPassword) {
      loginInfo.plainPassword = plainPassword;
    }
    if (type) loginInfo.type = type;

    await loginInfo.save();

    return res
      .status(200)
      .json({ message: "Cập nhật thông tin đăng nhập thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
