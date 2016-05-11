import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import moment from 'moment'
import styles from '../style/components/TemperatureChart.scss'

const TChart = (temperatures) => {
  const margins = {left: 0, right: 20, top: 10, bottom: 0}
  const data = temperatures.data.map(d => {
    return {
      time: moment(d.timestamp).format('HH:mm'),
      temperature: d.temperature / 1000
    }
  })

  return (
    <div className={styles.chart}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin= {margins}>
          <YAxis/>
          <XAxis dataKey='time' minTickGap={20} />
          <Tooltip />
          <CartesianGrid stroke='#f5f5f5' />
          <Line type='monotone' dataKey='temperature' name='Temperature' unit=' °C' stroke='#c62a51' isAnimationActive={false} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TChart