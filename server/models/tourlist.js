'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tourlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Bookmark, {
          as: "tourlist",
          through: "TourlistBookmark",
          foreignKey: "tourlist_id",
          onDelete: "cascade",
      });
    }
  }
  Tourlist.init({
    tourlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.CHAR(50),
    type: DataTypes.CHAR(50),
    road_address: DataTypes.CHAR(50),
    address_name: DataTypes.CHAR(50),
    img_url: DataTypes.CHAR(100),
    x: DataTypes.DOUBLE,
    y: DataTypes.DOUBLE
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "Tourlist",
    tableName: "Tourlist",
    paranoid: false,
    collate: "utf8_general_ci",
    charset: "utf8",
  });
  return Tourlist;
};