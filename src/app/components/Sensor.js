import React from 'react'
import Spinner from './Spinner'
import SensorSettings from './SensorSettings'
import TemperatureChart from './TemperatureChart'
import styles from '../style/components/Sensor.scss'
import { formatTemperature } from '../util'

const currentTemperature = temperatures => {
  if (!temperatures || (!temperatures.latest && temperatures.isFetching)) {
    return <Spinner />
  } else {
    const temperature = temperatures.latest ?
      `${formatTemperature(temperatures.latest.temperature)} °C` :
      'N/A'
    return <h4 className={styles.temperature}>{temperature}</h4>
  }
}

const Sensor = ({ name, id, temperatures, deleteSensor }) => {
  return (
    <li className={styles.sensor}>
      <div className={styles.data}>
        <div className={styles.info}>
          <h3>{name}</h3>
          <span>{id}</span>
        </div>
        {currentTemperature(temperatures)}
      </div>
      <SensorSettings deleteSensor={() => deleteSensor(id)}/>
      <TemperatureChart data={temperatures.items}/>
    </li>
  )
}

Sensor.propTypes = {
  name: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  temperatures: React.PropTypes.shape({
    isFetching: React.PropTypes.bool.isRequired,
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      temperature: React.PropTypes.number,
      timestamp: React.PropTypes.number
    })),
    latest: React.PropTypes.shape({
      temperature: React.PropTypes.number,
      timestamp: React.PropTypes.number
    }),
    lastUpdated: React.PropTypes.number
  }),
  deleteSensor: React.PropTypes.func.isRequired
}

Sensor.defaultProps = {
  temperatures: {
    isFetching: false,
    items: []
  }
}

export default Sensor
