'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookmarks', {
      bookmark_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER(10)
      },
      tourist_ids: {
        allowNull: false,
        type: Sequelize.JSON
      },
      workspace_ids: {
        allowNull: false,
        type: Sequelize.JSON
      },
      bookmark_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Bookmarks');
  }
};