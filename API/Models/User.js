// This contains the structure for Users. Has an id ,email that should be unique and required and should match the regex pattern. The password field is hashed
//with bcrypt algorithm with 10 salt rounds


const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : {type:String,
            required : true,
            unique : true,
            match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/     
    },
    password:{type:String,
        required : true        
}
    
})

module.exports = mongoose.model('User',userSchema)