
module.exports = (sequelize, DataTypes) => {
  var Sensor = sequelize.define('Sensor', {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: 'sensors'
  });
  return Sensor;
}
