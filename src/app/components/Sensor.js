import React from 'react'
import Spinner from './Spinner'
import styles from '../style/components/Sensor.scss'
import { formatTemperature } from '../util'

const currentTemperature = temperatures => {
  if (!temperatures || temperatures.isFetching) {
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
    </li>
  )
}

export default Sensor
