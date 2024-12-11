"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Balance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
    }
  }

  Balance.init(
    {
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Balance is required",
          },
          isInt: {
            msg: "Balance must be an integer",
          },
          min: {
            args: [0],
            msg: "Balance cannot be negative",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Balance",
      tableName: "balance",
    }
  );

  return Balance;
};
