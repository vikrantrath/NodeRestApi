// This contains the structure for Orders. Has an id , product that is a reference to Product model and a quantity with a default value
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : { type:mongoose.Schema.Types.ObjectId, ref : 'Product',required: true },
    Quantity : {type: Number,
                default: 1}
})

module.exports = mongoose.model('Order',orderSchema)