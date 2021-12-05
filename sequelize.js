const { Sequelize } = require('sequelize');
const {DB_NAME, DB_USER, DB_PWD, DB_HOST} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: function(){
        return true;
    } 
});

async function checkCOnnection(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error); 
    }
    
}

checkCOnnection();
exports.sequelize = sequelize;
exports.DataTypes = Sequelize.DataTypes;
exports.Model = Sequelize.Model;



