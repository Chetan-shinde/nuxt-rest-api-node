const express = require('express');
const validate = require('../middleware/validator.js');
const { body} = require('express-validator');
const productModel = require('../models/product.js');

module.exports = router = express.Router();

const validationRules = ()=>{
    return [
        body('product_id').exists().trim()
    ]
}

router.post('/',  async (req, res, next)=>{
    const products = await productModel.getProducts();
    res.send({success:true, status:1000, products, user:req.user || null});
});