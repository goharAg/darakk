const DataTypes = require('sequelize');
const Schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  state_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const Options = {
  tableName: 'states',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ State, Board, Task }) => {
  State.hasMany(Task, {
    sourceKey: 'id',
    foreignKey: 'state_id',
    as: 'tasks',
  });
};

module.exports = (sequelize) => {
  const model = sequelize.define('State', Schema, Options);
  model.associate = Association;
  return model;
};
