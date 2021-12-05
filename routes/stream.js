const express = require('express');
const { read } = require('fs');
const {Pool} = require('pg');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dvdrental',
    password: 'admin'
});

pool.on('error', (err, client)=>{
    console.error('unexpected error on idle client', err);
    process.exit(-1);
});


const { Readable } = require('stream');
module.exports = router = express.Router();

router.post('/', async function(req, res, next){
    var i = 1;
    
    const countSql = 'SELECT COUNT(*) FROM payment';
    const client = await pool.connect();
    
    const countPayment = await client.query(countSql);
    let noOfRows = countPayment.rows[0].count;
    noOfRows = parseInt(noOfRows);
    const loop = Math.ceil(noOfRows / 100);
    
    console.log(loop);
    res.setHeader('Content-Type', 'application/json');
    
    function CustomException(message) {
        const error = new Error(message);
        error.code = "THIS_IS_A_CUSTOM_ERROR_CODE";
        return error;
      }
      
    CustomException.prototype = Object.create(Error.prototype);
    console.log(new CustomException('test'));
    const inStream = new Readable({
        async read(){
            try {
                const sql = `SELECT * FROM payment OFFSET ${i-1} * 100 LIMIT 100`;
                const result = await client.query(sql);
                var x = 5 / 0;
                throw new CustomException("Please enter a valid age");
                i++;
                this.push(JSON.stringify(result.rows));
                console.log(x);
                if(i == 3){
                    this.push(null);
                }                
            } catch (error) {
                client.release();
                console.log(error.message);
                res.send({success:false, response:error.message});
               //throw error;
            }
        }
    });

    inStream.on('data', (chunk)=>res.write(chunk));
    inStream.on('end', ()=>{
        client.release();
        res.end();
    });
    inStream.on('error', (err)=>{
        client.release();
        res.send({success:false, response:err.message});
    });

    //console.log(countPayment);
    /*res.end();
    
    let result;
    const cursor = client.query(new Cursor(sql));
    



    cursor.on('data', (chunk)=>{
        i++;
        cursor.read(100, (err, rows)=>{
            if(err){
                throw err;
            }
            if(i == 5){
                cursor.close(()=>{
                    client.release();
                    res.end();
                });
            }else{
                res.write(rows);
            }
        });
    });*/
    /*cursor.read(100, (err, rows)=>{
        if(err){
            throw err;
        }
        cursor.read(100, (err, rows) => {
            assert(rows.length == 0)
        })
        i++;
        console.log(rows.length);
        if( i == 5 ){
            cursor.close(()=>{
                client.release();
                res.end();
            });
        }else{
            res.write(JSON.stringify(rows));
        }
    });*/

    /*try {
         result = client.query(sql);
    }catch (error) {
        console.log(`errorr stack ${error.stack}`)
        res.send({success:false, response:'Something went wrong'});
    }finally{
        console.log('final block');
        client.release();
    }*/

    //res.send({success:true, response:result});   
    /*var i = 1;
    const inStream = new Readable({
        async read(size){       
            const sql = `SELECT * FROM payment OFFSET ${(i-1) * 100} LIMIT 100`;
            const result = await sequelize.query(sql, { raw: true, type: sequelize.QueryTypes.SELECT});
            this.push(JSON.stringify(result));
            i++;
            if(i == 5){
                this.push(null);
            }    
        }
    });*/
    /*let r = "";
    inStream.on('data', (chunk)=> r += chunk);
    inStream.on('end', ()=>{
        r = r.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        r = r.replace(/[\u0000-\u0019]+/g,""); 
        var o = JSON.parse(r);
        res.send({success:true, response:r});
    });*/
    /*res.setHeader('Content-Type', 'application/json');
    inStream.on('data', (chunk) => {
        res.write(chunk)
    });
    inStream.on('end', () => {
        res.end();
    });*/
    //inStream.pipe(res);
    
});