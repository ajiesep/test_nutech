"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Service.init(
    {
      service_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Service code must be unique",
        },
        validate: {
          notNull: {
            msg: "Service code is required",
          },
          notEmpty: {
            msg: "Service code cannot be empty",
          },
        },
      },
      service_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Service name is required",
          },
          notEmpty: {
            msg: "Service name cannot be empty",
          },
        },
      },
      service_icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {
            args: true,
            msg: "Service icon must be a valid URL",
          },
        },
      },
      service_tariff: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Service tariff is required",
          },
          isInt: {
            msg: "Service tariff must be a number",
          },
          min: {
            args: [0],
            msg: "Service tariff must be greater than or equal to 0",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Services",
      tableName: "service",
    }
  );
  return Service;
};
