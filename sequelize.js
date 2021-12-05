const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('rest_nuxt', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false 
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



