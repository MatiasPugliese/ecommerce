const express = require('express');
const router = express.Router();
const{ User, Order, Order_Product, Product , Category, Brand, Image, Review}= require("../models")
const passport = require("passport")

//USER ADMIN ROUTES
router.post("/addAdmin", async function(req,res){
    if(req.user.status<3) return res.status(401).send("Solo para superadmin")
    const user = await User.findByPk(req.body.id)
    user.status = req.body.status
    await user.save()
    res.send(user)
})

//ORDERS ADMIN ROUTES
router.get("/orders", async function(req, res){
const allOrders = await Order.findAll({
  include: [{
    model: Product,
    as: 'products',
    required: false,
    attributes: ['id', 'name'],
    through: {
      model: Order_Product,
      as: 'order_products',
      attributes: ['quantity', "totalPrice"],
    }
  }]
})
res.send(allOrders) 
})


router.put("/orders/:id/update", async function(req, res){
    const {status} = req.body
    const order = await Order.findByPk(req.params.id)
    order.status = status
    await order.save()
    res.send(order)
    }
)

//PRODUCT ADMIN ROUTES


router.post("/products/add", async function(req,res,next) {

    const product = await Product.create(req.body.product)
    const [brand] = await Brand.findOrCreate({where: {
        name: req.body.brand.name,
        origin: req.body.brand.origin
    }})

    product.setBrand(brand)

    req.body.categories.forEach(async (element) => {
        const [category] = await Category.findOrCreate(
            {
            where: 
                {name: element.name}
            })
        await product.addCategory(category)
    })

    req.body.images.forEach(async (element) => {
        const image = await Image.create(element)
        await product.addImage(image)
    })

    res.send(product)
})

router.delete("/products/:id/delete", async function(req, res, next) {
    const id = req.params.id
    const product = await Product.findByPk(id)
    const images = await Image.findAll({where:{ProductId: id}})
    images.forEach(element => element.destroy())
    const reviews = await Review.findAll({where:{ProductId: id}})
    reviews.forEach(element => element.destroy())
    await product.destroy()
    res.sendStatus(200)
    }
  );

router.put("/products/:id/modify", async function(req, res, next) {
    const id = req.params.id
    let row = {}
    let product = {}
    if(req.body.product){
        [row, [product]] = await Product.update(
            req.body.product,
            {returning: true, where: {id}}
        )
        console.log(product)
    }else{
        product = await Product.findByPk(id)
    }

    if(req.body.brand){
        const [brand] = await Brand.findOrCreate({where: {
            name: req.body.brand.name,
            origin: req.body.brand.origin
            }}
        )
        product.setBrand(brand)
    }
    if(req.body.images.deleted){
        const {deleted} = req.body.images
        deleted.forEach(async imgid => {
            await Image.destroy({where: {id: imgid}})
        })
    }
    if(req.body.images.created){
        const {created} = req.body.images
        created.forEach(async url => {
            Images.create({url})
            await product.addImage(image)
        })
    }
    await product.save()
    res.send(product)
    }
)

module.exports= router