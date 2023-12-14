'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tourist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Bookmark, {
          as: "tourist",
          through: "TouristBookmark",
          foreignKey: "tourist_id",
          onDelete: "cascade",
      });
    }
  }
  Tourist.init({
    tourist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.CHAR(50),
    type: DataTypes.CHAR(50),
    road_address: DataTypes.CHAR(50),
    address_name: DataTypes.CHAR(50),
    img_url: DataTypes.CHAR(100),
    x: DataTypes.DOUBLE,
    y: DataTypes.DOUBLE,
    area_group: DataTypes.CHAR(50),
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "Tourist",
    tableName: "Tourist",
    paranoid: false,
    collate: "utf8_general_ci",
    charset: "utf8",
  });
  return Tourist;
};