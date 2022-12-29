'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('typing_tests', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      wpm: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      accuracy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('typing_tests')
  },
}
