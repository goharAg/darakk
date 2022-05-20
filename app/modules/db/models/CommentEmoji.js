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
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  emoji: {
    type: DataTypes.JSON,
    allowNull: false,
  },
};

const Options = {
  tableName: 'comment_emojis',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ CommentEmoji, Comment, User }) => {
  CommentEmoji.hasOne(User, {
    sourceKey: 'user_id',
    foreignKey: 'id',
    as: 'user',
  });
};

module.exports = (sequelize) => {
  const model = sequelize.define('CommentEmoji', Schema, Options);
  model.associate = Association;
  return model;
};
