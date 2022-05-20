const DataTypes = require('sequelize');
const Schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const Options = {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ Task, Comment, State, TaskAssignment }) => {
  Task.hasMany(Comment, {
    sourceKey: 'id',
    foreignKey: 'task_id',
    as: 'comments',
  });
  Task.hasMany(TaskAssignment, {
    sourceKey: 'id',
    foreignKey: 'task_id',
    as: 'task_assignments',
  });
};

module.exports = (sequelize) => {
  const model = sequelize.define('Task', Schema, Options);
  model.associate = Association;
  return model;
};
