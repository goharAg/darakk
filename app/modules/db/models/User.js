const DataTypes = require('sequelize');
const Schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_name: {
    type: DataTypes.STRING,
  },
};

const Options = {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',

  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    includePassword: {
      attributes: { include: ['password'] },
    },
  },
};

const Association = ({ User, Comment, UserBoardMapping, Board }) => {
  User.belongsToMany(Board, {
    through: 'UserBoardMapping',
    as: 'boards',
    foreignKey: 'user_id',
  });
};
module.exports = (sequelize) => {
  const model = sequelize.define('User', Schema, Options);
  model.associate = Association;
  return model;
};
