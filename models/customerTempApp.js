const { sequelize, DataTypes, Model } = require('../sequelize.js');

class CustomerTempApp extends Model{}

CustomerTempApp.init(
    {
        cust_temp_app_id:{type:DataTypes.BIGINT, primaryKey:true},
        cust_temp_app_device_id:{type:DataTypes.STRING, allowNull:false},
        cust_temp_app_device_type:{type:DataTypes.INTEGER, allowNull:false},
        cust_temp_app_token:{type:DataTypes.STRING, allowNull:false},
        cust_temp_app_created_date:{type:DataTypes.DATE, allowNull:false}
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'CustomerTempApp', // We need to choose the model name
        tableName: 'customer_temp_apps',
        timestamps: true,
        createdAt:'cust_temp_app_created_date',
        updatedAt:false
    }
);

module.exports = CustomerTempApp;