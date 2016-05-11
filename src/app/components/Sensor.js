import React from 'react'
import Spinner from './Spinner'
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

const Sensor = ({ name, id, temperatures }) => {
  return (
    <li className={styles.sensor}>
      <div className={styles.data}>
        <div className={styles.info}>
          <h3>{name}</h3>
          <span>{id}</span>
        </div>
        {currentTemperature(temperatures)}
      </div>
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
  })
}

Sensor.defaultProps = {
  temperatures: {
    isFetching: false,
    items: []
  }
}

export default Sensor
