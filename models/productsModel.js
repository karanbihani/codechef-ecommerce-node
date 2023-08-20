const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
    name:{
        type: String,
        required: [true, 'Please enter Product Name']
    },
    image:{
        type:String,
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fsample-stamp&psig=AOvVaw1l_fpLxnlz67AbQ9MH7dxV&ust=1692614757537000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNiqjL6H64ADFQAAAAAdAAAAABAE"
    },
    quantity:{
        type:Number,
        required:true,
        default: 0
    },
    price:{
        type:Number,
        required:false
    }
},
{
    timestamps:true
}
)

const Product = mongoose.model("Product", productSchema);

module.exports = Product;