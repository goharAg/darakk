const DataTypes = require('sequelize');
const Schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const Options = {
  tableName: 'task_assignments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ TaskAssignment, User, Task }) => {};

module.exports = (sequelize) => {
  const model = sequelize.define('TaskAssignment', Schema, Options);
  model.associate = Association;
  return model;
};
