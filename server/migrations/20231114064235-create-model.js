'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Models', {
      model_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      path: {
        allowNull: false,
        type: Sequelize.CHAR(200)
      },
      learn_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      performance: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Models');
  }
};