module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('states', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      board_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'boards',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      state_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('states');
  },
};
