import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import { fetchSensorsIfNeeded } from './actions/SensorActions'
import { fetchTemperaturesIfNeeded } from './actions/TemperatureActions'
import rootReducer from './reducers'
import App from './components/App'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

store.dispatch(fetchSensorsIfNeeded()).then(() => {
  store.getState().sensors.items.forEach(sensor => {
    store.dispatch(fetchTemperaturesIfNeeded(sensor.id))
  })
})

render(<Provider store={store}><App /></Provider>, document.getElementById('app'))
