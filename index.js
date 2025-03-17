const express = require("express")
var methodOverride = require('method-override')
const app = express()
const path = require("path")
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static("public"));
const mongoose = require("mongoose")
const Product = require("./Models/product")
mongoose.connect("mongodb://localhost:27017/farmShop", { useNewUrlParser: true})
    .then(()=>{
 console.log("Connection Successful")
 })
 .catch(()=>{
    console.log("Error Occured")
    console.log(err)
 })



app.get("/product", async (req, res)=>{
    const products = await Product.find({});
    console.log(products);
    res.render("products/product", { products });
    
})
app.get("/product/:id", async (req, res)=>{
    const { id } = req.params
    const product = await Product.findById(id)
    console.log(product)
    res.render("products/show", {product})
})
app.get("/products/new", (req, res)=>{
   res.render("products/new")
})

app.post("/products", async (req, res)=>{
 const newProduct = new Product(req.body)
 await newProduct.save()
 console.log(newProduct)
 res.redirect(`/product/${newProduct._id}`)
 
})

// Edit product
app.get("/product/:id/edit", async (req, res)=>{
    const { id } = req.params
    const product = await Product.findById(id)
    res.render("products/edit", {product})
})
app.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/product/${id}`); 
});
app.delete("/products/:id", async (req, res)=>{
    const { id } = req.params;
    await Product.findByIdAndDelete(id)
    res.redirect("/product")
    
})



app.listen(3000, ()=>{
    console.log("Server started")
})