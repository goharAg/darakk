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
  order: {
    type: DataTypes.STRING,
  },
};

const Options = {
  tableName: 'state_order_mapping',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const Association = ({ StateOrderMapping, State }) => {
  StateOrderMapping.hasMany(State, {
    sourceKey: 'state_id',
    foreignKey: 'id',
    as: 'states',
  });
};

module.exports = (sequelize) => {
  const model = sequelize.define('StateOrderMapping', Schema, Options);
  model.associate = Association;
  return model;
};
