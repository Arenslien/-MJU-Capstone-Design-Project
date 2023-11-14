'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Bookmark, {
                as: "Bookmark",
                foreignKey: "user_id",
                onDelete: "cascade",
            });
        }
    }
    User.init({
        user_id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
        },
        kakao_email: DataTypes.CHAR(50),
        name: DataTypes.CHAR(50),
        join_date: DataTypes.DATE,
        category_1: DataTypes.INTEGER(10),
        category_2: DataTypes.INTEGER(10),
        category_3: DataTypes.INTEGER(10),
        gender: DataTypes.BOOLEAN
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: "User",
            tableName: "User",
            paranoid: false,
            collate: "utf8_general_ci",
            charset: "utf8",
    }); 
    return User;
};