'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User,{
          as: "User",
          foreignKey: "user_id",
          onDelete: "cascade",
      });
      this.belongsToMany(models.Tourist, {
          as: "tourist",
          through: "TouristBookmark",
          foreignKey: "tourist_id",
          onDelete: "cascade",
      });
      this.belongsToMany(models.Workspace, {
          as: "workspace",
          through: "WorkspaceBookmark",
          foreignKey: "workspace_id",
          onDelete: "cascade",
      });
    }
  }
  Bookmark.init({
    bookmark_id: { 
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    tourist_ids: DataTypes.JSON,
    workspace_ids: DataTypes.JSON,
    bookmark_date: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "Bookmark",
    tableName: "Bookmark",
    paranoid: false,
    collate: "utf8_general_ci",
    charset: "utf8",
  });
  return Bookmark;
};