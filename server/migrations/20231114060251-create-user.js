'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user_id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER(10)
      },
      kakao_email: {
        allowNull: false,
        type: Sequelize.CHAR(50)
      },
      name: {
        type: Sequelize.CHAR(50)
      },
      join_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      category_1: {
        type: Sequelize.INTEGER(10)
      },
      category_2: {
        type: Sequelize.INTEGER(10)
      },
      category_3: {
        type: Sequelize.INTEGER(10)
      },
      gender: {
        type: Sequelize.BOOLEAN
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};