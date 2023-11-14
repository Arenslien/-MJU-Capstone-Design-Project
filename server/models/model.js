'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Models extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {

    }
  }
  Model.init({
    model_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    path: DataTypes.CHAR(200),
    learn_date: DataTypes.DATE,
    performance: DataTypes.FLOAT
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "Models",
    tableName: "Model",
    paranoid: false,
    collate: "utf8_general_ci",
    charset: "utf8",
  });
  return Models;
};