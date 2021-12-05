const { sequelize, DataTypes, Model } = require('../sequelize.js');

class Customer extends Model{}

Customer.init(
    {
        cust_id:{type:DataTypes.BIGINT, allowNull:false, primaryKey:true},
        cust_firstname:{type:DataTypes.STRING},
        cust_lastname:{type:DataTypes.STRING},
        cust_phone:{type:DataTypes.BIGINT},
        cust_email:{type:DataTypes.STRING, allowNull:false},
        cust_password:{type:DataTypes.STRING, allowNull:false},
        cust_created_date:{type:DataTypes.DATE, allowNull:false},
        cust_modified_date:{type:DataTypes.DATE}
    },
    {
        sequelize,
        modelName: 'Customer', // We need to choose the model name
        tableName: 'customers',
        timestamps: true,
        createdAt:'cust_created_date',
        updatedAt: 'cust_modified_date'
    }
);

module.exports = Customer;
