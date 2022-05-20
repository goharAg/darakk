module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users_boards_mapping', {
      fields: ['user_id', 'board_id'],
      type: 'unique',
      name: 'unique_index',
    });
  },

  async down(queryInterface, Sequelize) {},
};
