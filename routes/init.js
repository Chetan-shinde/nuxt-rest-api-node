const express = require('express');


const domainModel = require('../models/domain.js');
const errorMessages = require('../errormessages.js');

// ...rest of the initial code omitted for simplicity.
const { body, validationResult } = require('express-validator');


module.exports = router = express.Router();

// parallel processing
const validate = validations => {
    return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    res.status(400).json({ errors: errors.array() });
    };
};

const validationRules = () => {1
    return [
        body('language').exists().trim(),
        body('client_id').exists().trim(),
        body('client_secret').exists().trim(),
        body('device_id').exists().trim(),
        body('device_type').exists().trim()
    ]
}

router.post('/', validate(validationRules()), async function(req, res, next){
    
    const domain = await domainModel.findOne({
                attributes:['domain_id', 'domain_name', 'domain_language', 'domain_created_date', 'domain_modified_date'],
                where:{domain_language:'en'}
            }
    );
    let bearerToken = '';
    if(req.headers['authorization'] && req.headers['authorization'].includes("Bearer ")){
        bearerToken = req.headers['authorization'].replace("Bearer ", "");
    }
    if(domain){
        res.send({
            domainDetails:{domain_id:57, domain_name:'121UK', domain_url:'http://121doc.com'},
            token:req.token || bearerToken,
            results:domain
        });

    }else{
        res.send(errorMessages.invalid_request);
    }

});