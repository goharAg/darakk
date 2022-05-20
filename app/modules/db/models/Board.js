const DataTypes = require('sequelize');
const Schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const Options = {
  tableName: 'boards',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ Board, State, UserBoardMapping, User }) => {
  Board.belongsToMany(User, {
    through: 'UserBoardMapping',
    foreignKey: 'board_id',
    as: 'users',
  });
  Board.hasMany(State, {
    sourceKey: 'id',
    foreignKey: 'board_id',
    as: 'states',
  });
};

module.exports = (sequelize) => {
  const model = sequelize.define('Board', Schema, Options);
  model.associate = Association;
  return model;
};
