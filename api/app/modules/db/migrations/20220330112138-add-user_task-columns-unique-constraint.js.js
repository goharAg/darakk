'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('task_assignments', {
      fields: ['user_id', 'task_id'],
      type: 'unique',
      name: 'unique_index',
    });
  },

  async down(queryInterface, Sequelize) {},
};
