const Account = require("../models/accountModel");
const loginInfoModel = require("../models/loginInfoModel");
const LoginInfo = require("../models/loginInfoModel");

// Tạo mã tự động chỉ có 4 chữ số sau LQ và kiểm tra trùng lặp
const generateCode = async () => {
  let code;
  let isDuplicate = true;

  // Kiểm tra trùng lặp mã cho đến khi có mã không bị trùng
  while (isDuplicate) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Tạo 4 số ngẫu nhiên từ 1000 đến 9999
    code = `LQ${randomDigits}`; // Ghép "LQ" + 4 chữ số ngẫu nhiên

    // Kiểm tra xem mã có bị trùng trong cơ sở dữ liệu không
    const existingAccount = await Account.findOne({ code });
    if (!existingAccount) {
      isDuplicate = false; // Nếu không trùng, thoát khỏi vòng lặp
    }
  }

  return code;
};

// Tạo mới tài khoản
exports.createAccount = async (req, res) => {
  try {
    const { username, plainPassword, type, ...accountData } = req.body; // Lấy thông tin đăng nhập và tài khoản từ body
    const existLoginAccount = await LoginInfo.findOne({ username });
    if (existLoginAccount)
      return res.status(400).json({ message: "Tài khoản này đã tồn tại" });

    // Tạo thông tin đăng nhập
    const loginInfo = new LoginInfo({
      username,
      plainPassword,
      type,
    });

    await loginInfo.save(); // Lưu thông tin đăng nhập

    // Tạo tài khoản với mã tự động
    const code = await generateCode();

    const account = new Account({
      ...accountData, // Thêm các thông tin tài khoản
      code,
      loginInfo: loginInfo._id, // Liên kết đến bảng LoginInfo
    });

    await account.save(); // Lưu tài khoản vào cơ sở dữ liệu
    res
      .status(201)
      .json({ message: "Tài khoản đã được tạo thành công", account });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo tài khoản", error: error.message });
  }
};

// Lấy danh sách tài khoản có phân trang và filter theo code
exports.getAllAccounts = async (req, res) => {
  try {
    // Lấy params, chuyển về số
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const codeRaw = (req.query.code || "").trim();

    const skip = (page - 1) * limit;

    // Xây filter
    const filter = {};
    if (codeRaw) {
      filter.code = { $regex: codeRaw, $options: "i" }; // tìm không phân biệt hoa thường
    }

    // Query song song: đếm tổng vs lấy page
    const [total, accounts] = await Promise.all([
      Account.countDocuments(filter),
      Account.find(filter).skip(skip).limit(limit).lean(),
    ]);

    // Trả về kết quả đúng định dạng
    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      accounts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tài khoản",
      error: error.message,
    });
  }
};

// Lấy tài khoản theo mã
exports.getAccountByCode = async (req, res) => {
  const { code } = req.params; // Lấy mã tài khoản từ URL
  try {
    const account = await Account.findOne({ code }); // Tìm tài khoản theo mã
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    res.status(200).json(account);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy tài khoản", error: error.message });
  }
};

// Cập nhật tài khoản theo mã
exports.updateAccount = async (req, res) => {
  const { idAccount } = req.body; // Lấy mã tài khoản từ URL
  try {
    const account = await Account.findOneAndUpdate({ _id: idAccount }, req.body, {
      new: true,
    }); // Cập nhật tài khoản

    if (req.body.username || req.body.plainPassword) {
      const infoAcc = await loginInfoModel.findOneAndUpdate(
        { _id: req.body.idInfoAcc },
        req.body,
        { new: true }
      );
      if (!infoAcc) {
        return res.status(404).json({ message: "Tài khoản đăng nhập không tồn tại" });
      }
      res.status(200).json({ message: "Tài khoản đã được cập nhật", infoAcc });
    }
    
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    res.status(200).json({ message: "Tài khoản đã được cập nhật", account });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật tài khoản", error: error.message });
  }
};

// Xóa tài khoản theo mã
exports.deleteAccount = async (req, res) => {
  const { code } = req.params; // Lấy mã tài khoản từ URL
  try {
    const account = await Account.findOneAndDelete({ code }); // Xóa tài khoản theo mã
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    res.status(200).json({ message: "Tài khoản đã được xóa thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa tài khoản", error: error.message });
  }
};
