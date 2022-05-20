module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'image_name', Sequelize.STRING);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'image_name');
  },
};
