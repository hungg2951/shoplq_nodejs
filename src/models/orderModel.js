const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // Người mua
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // Acc đã mua
    price:     { type: Number, required: true },  // Giá đã mua (có thể đã giảm giá)
    coinUsed:  { type: Number, required: true },  // Coin đã trừ

    status:    { type: String, default: 'success' }, // success | failed | refunded
    note:      { type: String },

  },{timestamps:true}
)

module.exports = mongoose.model('Order', orderSchema)
