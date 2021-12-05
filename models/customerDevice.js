const { sequelize, DataTypes, Model } = require('../sequelize.js');

class CustomerDevice extends Model{}

CustomerDevice.init(
    {
        cust_device_id:{type:DataTypes.STRING, allowNUll:false},
        cust_device_type:{type:DataTypes.INTEGER, allowNUll:false},
        cust_device_token:{type:DataTypes.STRING, allowNUll:false},
        cust_device_created_date:{type:DataTypes.DATE, allowNUll:false},
        cust_device_cust_id:{type:DataTypes.INTEGER, allowNUll:false}
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'CustomerDevice', // We need to choose the model name
        tableName: 'customer_device_details',
        timestamps: true,
        createdAt:'cust_device_created_date',
        updatedAt: false
    }
);
CustomerDevice.removeAttribute('id');
module.exports = CustomerDevice;