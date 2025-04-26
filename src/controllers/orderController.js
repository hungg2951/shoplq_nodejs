const Account = require("../models/accountModel");
const Order = require("../models/orderModel");
const userModel = require("../models/userModel");
const { sendEMail } = require("./sendMail");

exports.create = async (req, res) => {
  const { idAcc } = req.body;

  try {
    const account = await Account.findOne({ _id: idAcc }).populate("loginInfo");
    const loginInfo = account?.loginInfo;
    const user = await userModel.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    if (!account)
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    if (account.isSold)
      return res.status(400).json({ message: "Tài khoản đã được bán" });

    if (user.coin < account.price) {
      return res
        .status(400)
        .json({ message: "Bạn không đủ coin để mua acc này" });
    }

    user.coin -= account.price;
    await user.save();

    account.isSold = true;
    account.buyerId = user._id;
    await account.save();

    const order = await Order.create({
      userId: user._id,
      accountId: account._id,
      price: account.price,
      coinUsed: account.price,
      status: "success",
    });

    const subject = "THÔNG TIN TÀI KHOẢN";
    const html = `<p><b>Bạn vừa mua tài khoản mã ${
      account.code
    } giá ${account.price.toLocaleString()}đ tại Shop LQ</b></p>
        <p>Tên đăng nhập : <b>${loginInfo.username}</b></p>
        <p>Mật khẩu : <b>${loginInfo.plainPassword}</b></p>
        <p>Vì tính bảo mật, Vui lòng không chia sẻ với bất kỳ ai</p>
        <p><strong>Trân trọng!</strong></p>
        <p>SHOP LQ</p>`;

    sendEMail(user.email, subject, html);

    return res.status(200).json({
      message: "Mua acc thành công!",
      order,
    });
  } catch (error) {
    console.error("Lỗi khi mua account:", error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};
