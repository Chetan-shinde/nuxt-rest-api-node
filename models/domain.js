const { sequelize, DataTypes, Model } = require('../sequelize.js');

class Domain extends Model {}

Domain.init(
    {
        domain_id:{type:DataTypes.INTEGER,allowNull: false},
        domain_name:{type:DataTypes.STRING,allowNull: false },
        domain_language:{type:DataTypes.STRING,allowNull: false },
        domain_created_date:{type:DataTypes.DATE,allowNull: false },
        domain_modified_date:{type:DataTypes.DATE}
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'Domain', // We need to choose the model name
        tableName: 'domains',
        timestamps: true,
        createdAt:'domain_created_date',
        updatedAt:'domain_modified_date'
    }
);

module.exports = Domain;