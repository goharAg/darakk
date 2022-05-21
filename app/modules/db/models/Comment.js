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
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const Options = {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ User, Comment, Task }) => {
  Comment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

module.exports = (sequelize) => {
  const model = sequelize.define('Comment', Schema, Options);
  model.associate = Association;
  return model;
};
