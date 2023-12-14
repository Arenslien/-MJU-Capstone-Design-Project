'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tourists', {
      tourist_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.CHAR(50)
      },
      type: {
        allowNull: false,
        type: Sequelize.CHAR(50)
      },
      road_address: {
        allowNull: false,
        type: Sequelize.CHAR(50)
      },
      address_name: {
        allowNull: false,
        type: Sequelize.CHAR(50)
      },
      img_url: {
        allowNull: false,
        type: Sequelize.CHAR(100)
      },
      x: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      y: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      area_group: {
        allowNull: false,
        type: Sequelize.CHAR(50)
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Tourists');
  }
};