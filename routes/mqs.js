const express = require('express');
const fs = require('fs');
const Path = require('path');

module.exports = router = express.Router();

router.post('/getmqs', function(req, res, next){
    console.log("inner mq");
    const f = Path.dirname(__dirname);
    const filePath = Path.join(f, "mqs.json")
    if( fs.existsSync(filePath) ){
        const readStream = fs.createReadStream(filePath);
        let js = "";
        readStream.on('data', (chunk)=>{
            js += chunk;
        });
        readStream.on('end', ()=>{
           res.send({success:true, response:JSON.parse(js)});
        });
        //readStream.pipe(res);
    }else{
        res.send({success:true, response:'file not exists'});
    }
});