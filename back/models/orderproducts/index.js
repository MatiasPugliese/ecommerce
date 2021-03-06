const db = require("../../db");
const S = require("sequelize");

class Order_Product extends S.Model {}

Order_Product.init(
  {
    id: {
      type: S.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // orderId: {
    //   type: S.INTEGER,
    //   references: {
    //     model: "Orders",
    //     key: "id"
    //   }
    // },
    // productId: {
    //   type: S.INTEGER,
    //   references: {
    //     model: "Products",
    //     key: "id"
    //   }
    // },
    quantity: {
      type: S.INTEGER,
      defaultValue: 0
    },
    totalPrice: {
      type: S.INTEGER,
      defaultValue: 0
    }
  },
  {
    // Other model options go here
    sequelize: db, // We need to pass the connection instance
    modelName: "Order_Product" // We need to choose the model name
  }
);
module.exports = Order_Product;
