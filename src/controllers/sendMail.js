const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEMail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_SEND,
      pass: process.env.PASS_EMAIL,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SEND,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (email, code) => {
  const subject = "XÁC THỰC TÀI KHOẢN";
  const html = `<p>Mã xác thực tài khoản của bạn là: <b>${code}</b></p>
        <p>Mã xác thực của bạn có hiệu lực trong 2 phút kể từ lúc nhận được email này</p>
        <p>Vì tính bảo mật, Vui lòng không chia sẻ với bất kỳ ai</p>
        <p><strong>Trân trọng!</strong></p>
        <p>SHOP LQ</p>
        `;
  await sendEMail(email, subject, html);
};

module.exports = { sendVerificationEmail, sendEMail };
