import React from 'react'
import Sensor from './Sensor'
import styles from '../style/components/SensorList.scss'

export const SensorList = ({ sensors, temperaturesBySensor }) => {
  return (
    <ul className={styles.root}>
      {sensors.map(({name, id}) =>
        <Sensor
          key={id}
          name = {name}
          id = {id}
          temperatures = {temperaturesBySensor[id]}
        />
      )}
    </ul>
  )
}

SensorList.propTypes = {
  sensors: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  })),
  temperaturesBySensor: React.PropTypes.object
}

export default SensorList