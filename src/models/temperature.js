
module.exports = (sequelize, DataTypes) => {
  const Temperature = sequelize.define('Temperature', {
    temperature: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'temperatures',
    indexes: [
      {
        fields: ['timestamp']
      }
    ],
    classMethods: {
      associate: models => {
        Temperature.belongsTo(models.Sensor, {
          onDelete: 'CASCADE',
          foreignKey: {
            name: 'sensor_id',
            allowNull: false
          }
        })
      }
    }
  })
  return Temperature
}
