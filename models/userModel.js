const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
    name:{
        type: String,
        required: [true, 'Please enter User Name']
    },
    password:{
        type:String,
        required: true,
        default: "root"
    }
},
{
    timestamps:true
}
)

const User = mongoose.model("User", userSchema);

module.exports = User;