const express = require('express');
const validator = require('../middleware/validator.js');
const customerModel = require('../models/customer.js');
const customerTempAppModel = require('../models/customerTempApp.js');
const customerDeviceModel = require('../models/customerDevice.js');
const { sequelize } = require('../sequelize.js');

const crypto = require('crypto');
const hashingSecret = "TC4MB4PfxU";

module.exports = router = express.Router();

const { body} = require('express-validator');
const { errorMessages } = require('../errormessages');



const validationRules = () => {
    return [
        body('email').exists().isEmail().trim(),
        body('password').exists().trim()
    ]
}

router.post('/', validator(validationRules()),  async (req, res, next)=>{
    //find cusomer by email
    const customer = await customerModel.findOne({
        attributes:['cust_id', 'cust_email', 'cust_password', 'cust_firstname', 'cust_lastname', 'cust_phone'],
        where:{cust_email:req.body.email}
    });
    if(customer){
        //check password hash
        const password = crypto.createHmac('sha256', hashingSecret)
                        .update(req.body.password)
                        .digest('hex');
        if(customer.cust_password === password){
            //move token from temp to cust device
            await moveToken(req, customer);
            res.send({success:true, status:1000, customer});
        }else{
            res.send(errorMessages.invalid_password);
        }
    }else{
        res.send(errorMessages.invalid_email);
    }
});

router.post('/register', validator(validationRules()), async function(req, res, next){
    const customer = await customerModel.findOne({
        attributes:['cust_id', 'cust_email', 'cust_firstname', 'cust_lastname', 'cust_phone'],
        where:{cust_email:req.body.email}
    });

    if(!customer){
        //create customer
        //move token
        const password = crypto.createHmac('sha256', hashingSecret)
        .update(req.body.password)
        .digest('hex');
        const customer = await customerModel.create(
            {cust_email:req.body.email, cust_password:password, cust_created_date:sequelize.NOW},
            {fields:['cust_email', 'cust_password', 'cust_created_date', ]}
            );
        await moveToken(req, customer);
        res.send({success:true, status:1000, customer});
    }else{
        res.send(errorMessages.user_exist);
    }
});

router.post('/logout', async (req, res, next)=>{
    if(req.user){
        await moveTokenToTemp(req);
        res.send({success:true, status:1000, response:'logout successfully.'});
    }else{
        res.send(errorMessages.invalid_request);
    }
});

async function moveToken(req, customer){
    let bearerToken = null;
    if(req.headers['authorization'].includes("Bearer ")){
        bearerToken = req.headers['authorization'].replace("Bearer ", "");
    }
    const customerTempApp =  await customerTempAppModel.findOne({
        where:{cust_temp_app_device_id:req.body.device_id, cust_temp_app_device_type:req.body.device_type, cust_temp_app_token:bearerToken}
    });

    if(customerTempApp){
        await customerDeviceModel.create(
            {cust_device_id:req.body.device_id, cust_device_type:req.body.device_type, cust_device_token:bearerToken, cust_device_created_date:sequelize.NOW, cust_device_cust_id:customer.cust_id},
            {fields:['cust_device_id', 'cust_device_type', 'cust_device_token', 'cust_device_created_date', 'cust_device_cust_id']}
        )
        await customerTempAppModel.destroy({
            where:{cust_temp_app_device_id:req.body.device_id, cust_temp_app_device_type:req.body.device_type, cust_temp_app_token:bearerToken}
        });
    }
}

async function moveTokenToTemp(req){

    let bearerToken = null;
    if(req.headers['authorization'].includes("Bearer ")){
        bearerToken = req.headers['authorization'].replace("Bearer ", "");
    }

    const customerTempApp = await customerTempAppModel.create(
        {
            cust_temp_app_device_id:req.body.device_id,
            cust_temp_app_device_type:req.body.device_type,
            cust_temp_app_token: bearerToken,
            cust_temp_app_created_date:sequelize.NOW
        },
        {
            fields:['cust_temp_app_device_id', 'cust_temp_app_device_type', 'cust_temp_app_token', 'cust_temp_app_created_date']
        }
    );
    
    //destroy from customer device
    await customerDeviceModel.destroy({ where:{ cust_device_id:req.body.device_id, cust_device_type:req.body.device_type, cust_device_token: bearerToken } });

}