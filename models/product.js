const { sequelize, DataTypes, Model } = require('../sequelize.js');

class Product extends Model{
    static async getProducts(){
        const products = await sequelize.query(
            `
            SELECT p.prod_id, p.prod_name, p.prod_price, pc.cat_id, c.cat_name FROM products p
            INNER JOIN product_categories pc ON p.prod_id = pc.prod_id
            INNER JOIN categories c ON c.cat_id = pc.cat_id
            `, {type:sequelize.QueryTypes.SELECT}
        );
        return products;
    }
}

Product.init({
    prod_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey:true
    },
    prod_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    prod_price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    prod_created_at:{
        type: DataTypes.DATE,
        allowNull: false
    },
    prod_modified_at:{
        type: DataTypes.DATE
    }
},{
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Product', // We need to choose the model name
    tableName: 'products',
    timestamps: true, // don't forget to enable timestamps!
    createdAt: 'prod_created_at',
    updatedAt: 'prod_modified_at'
  });

  module.exports = Product;