const customerTempAppModel = require('../models/customerTempApp.js');
const customerDeviceModel = require('../models/customerDevice.js');
const customerModel = require('../models/customer.js');
const {errorMessages} = require('../errormessages.js');
const jwt = require('jsonwebtoken');
const db = require('../sequelize.js');

exports.checkAuthorization = async (req, res, next)=>{
    let token = '';
    if(req.path == '/init' && !req.headers['authorization']){
        
         //check token exists in temp for same device id , device type
         const customerTemp = await customerTempAppModel.findOne({
            where:{cust_temp_app_device_id:req.body.device_id, cust_temp_app_device_type:req.body.device_type}
        });
        
        let flag = true;
        if(customerTemp){
            //check token is valid
            try {
                const decoded = jwt.verify(customerTemp.cust_temp_app_token, process.env.JWTSECRET ); 
                token = customerTemp.cust_temp_app_token;
                req.token = token;
                flag=false;
                next();
            } catch (error) {
                //destroy it
                const noOfDeletedRow = await customerTempAppModel.destroy({
                    where:{cust_temp_app_token: customerTemp.cust_temp_app_token}
                });
                flag = true;
            }
        }
        else{
            const cutomerDevice = await customerDeviceModel.findOne({
                where:{cust_device_id:req.body.device_id, cust_device_type:req.body.device_type}
            });
            if(cutomerDevice){
                try {
                    const decoded = jwt.verify(cutomerDevice.cust_device_token, process.env.JWTSECRET ); 
                    token = cust_device_token;
                    req.token = token;
                    const customer = await customerModel.findOne({
                        where:{cust_id:customerDevice.cust_device_cust_id}
                    });
                    req.user = customer;
                    flag=false;
                } catch (error) {
                    //destroy it
                    const noOfDeletedRow = await customerDeviceModel.destroy({
                        where:{cust_device_token: cutomerDevice.cust_device_token}
                    }); 
                    flag = true;
                }
            }
        }
        
        if(flag){
            token = await createTempToken(req);
            req.token = token;
            next();
        }

    }else{
        if( req.headers['authorization'] ){

       
            let bearerToken = null;
            if(req.headers['authorization'].includes("Bearer ")){
                bearerToken = req.headers['authorization'].replace("Bearer ", "");
            }
           
            try {
                
                const decoded = jwt.verify(bearerToken, process.env.JWTSECRET );
                
                //check token first with customer  table
                const customerDevice = await customerDeviceModel.findOne({
                    where:{cust_device_id:req.body.device_id, cust_device_type:req.body.device_type, cust_device_token:bearerToken}
                });

                if(customerDevice){
                    const customer = await customerModel.findOne({
                        where:{cust_id:customerDevice.cust_device_cust_id}
                    });
                    req.user = customer;
                    next();
                }else{
                    //check token in temp table
                    const customerTemp = await customerTempAppModel.findOne({
                        where:{cust_temp_app_device_id:req.body.device_id,
                                cust_temp_app_device_type:req.body.device_type,
                                cust_temp_app_token:bearerToken
                            }
                    });
                    if(!customerTemp){
                        //insert token in temporary table
                        res.send(errorMessages.invalid_token);
                    }else{
                        next();
                    }
                    
                }

            } catch (error) {
                //token invalid redirect to login
                //check token in temporary table
                //console.log(error);
                const noOfDeletedRow = await customerTempAppModel.destroy({
                    where:{cust_temp_app_token: bearerToken, cust_temp_app_device_id: req.body.device_id}
                });

                if(!noOfDeletedRow){
                    //delete from customer device
                    const noOfDeletedRow = await customerDeviceModel.destroy({
                        where:{cust_device_token: bearerToken, cust_device_id: req.body.device_id}
                    }); 
                }

                token = await createTempToken(req);
                console.log(token);
                res.status(401).send({success:true, status:1000, response:{newtoken:token}});
            }
        }else{
            res.send(errorMessages.token_required);
        }
    }
    
}

//create new Temp Token
//Insert token into customer temp apps
async function createTempToken(req){

    //check token there 
    const customerTempApp = await customerTempAppModel.findOne({
        attributes:['cust_temp_app_device_id', 'cust_temp_app_device_type', 'cust_temp_app_token'],
        where:{cust_temp_app_device_id:req.body.device_id, cust_temp_app_device_type:req.body.device_type}
    });

    if(customerTempApp){
        return customerTempApp.cust_temp_app_token;
    }else{

        const jwtToken = jwt.sign({ device_type : req.body.device_type, device_id : req.body.device_id }, process.env.JWTSECRET, { expiresIn: "24h"});
        const insertData = {
            cust_temp_app_device_id:req.body.device_id,
            cust_temp_app_device_type: req.body.device_type,
            cust_temp_app_token: jwtToken,
            cust_temp_app_created_date:db.NOW
        };
      
        await customerTempAppModel.create(insertData, {fields:['cust_temp_app_device_id', 'cust_temp_app_device_type', 'cust_temp_app_token', 'cust_temp_app_created_date'] });
        return jwtToken;
    }

}