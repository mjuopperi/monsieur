module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Sensor', {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'sensors'
  })
}
