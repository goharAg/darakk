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
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    unique: true,
  },
};

const Options = {
  tableName: 'users_boards_mapping',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ UserBoardMapping, User, Board }) => {
  UserBoardMapping.hasMany(Board, {
    sourceKey: 'board_id',
    foreignKey: 'id',
    as: 'boards',
  });
  UserBoardMapping.hasOne(User, {
    sourceKey: 'user_id',
    foreignKey: 'id',
    as: 'user',
  });
};

module.exports = (sequelize) => {
  const model = sequelize.define('UserBoardMapping', Schema, Options);
  model.associate = Association;
  return model;
};
