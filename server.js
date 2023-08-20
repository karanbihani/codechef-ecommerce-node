require('dotenv').config()

//var mysql = require('mysql2');
const mongoose = require("mongoose")
const express = require('express');
const app = express()
const User = require('./models/userModel')
const Product = require('./models/productsModel')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
//middleware

app.use(express.json()) //allows to read json
app.use(express.urlencoded({extended:false})) //allows to read forms

//routes=>

// Product API

app.get('/products', authenthicateToken,async(req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }catch(error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})

app.get('/products/:id', authenthicateToken,async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Can not find any product wiht the id: "+ id})
        }
        else res.status(200).json(product);
    }catch(error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})

app.put('/products/:id', authenthicateToken,async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message:'Can not find any product wiht the id '+ id})
        }
        else{
            const Updatedproduct = await Product.findById(id); 
            res.status(200).json(Updatedproduct);
        }
    }catch(error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})

app.delete('/products/:id', authenthicateToken,async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id, req.body);
        if(!product){
            return res.status(404).json({message:'Can not find any product wiht the id '+ id})
        }
        else{
            res.status(200).json(product);
        }
    }catch(error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})

app.post("/products", authenthicateToken,async(req, res)=>{
    try{
        console.log(req.user.name)
        const product = await Product.create(req.body)
        res.status(200).json(product);
    } catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
    // console.log(req.body);
    // res.send(req.body);
})

//Users API

//Need to add JWT tokens and return that?
app.post("/user/signup", authenthicateToken,async(req, res)=>{
    try{
        const existingUser = await User.findOne({name:req.body.name})
        if(existingUser){
            return res.status(400).json({message:"User already existis"});
        }
        const hashPassword = await bcrypt.hash(req.body.password,10)
        req.body.password = hashPassword
        const user = await User.create(req.body)
        res.status(200).json(user);
    } catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})

app.post("/user/signin",async(req, res)=>{
    try{
        const user = await User.findOne({name: req.body.name})
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        else{
            if (bcrypt.compare(req.body.password, user.password)){
                console.log("Logged In"); 
                const accessToken = jwt.sign(user.name, process.env.SECRET_ACCESS_TOKEN)
                res.status(200).json({accessToken:accessToken});
            }
        }
    } catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})

function authenthicateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    console.log(token)
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN,(err,user)=>{
        if(err) return res.status(403) 
        req.user = user     
    })
}


mongoose.set("strictQuery",false)
mongoose.
connect('mongodb+srv://admin:'+process.env.pwd+'@ecommerce.8cpsgyo.mongodb.net/eccomerce-API?retryWrites=true&w=majority')
.then(()=>{
    app.listen(3000, ()=>{
        console.log("Node API running on port 3000");
    }) 
    console.log("Connected to MongoDB")
}).catch(()=>{
    console.log(error)
})