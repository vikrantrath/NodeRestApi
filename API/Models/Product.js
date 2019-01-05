// This contains the structure for Products. Has an id ,name,price and productImage which contains the path to the images in uploads folder


const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type: String,
            required : true},
    price : {type: Number,
            required : true},
    productImage : {type:String

    }
})

module.exports = mongoose.model('Product',productSchema)