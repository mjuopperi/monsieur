import fetch from 'isomorphic-fetch'

export const REQUEST_SENSORS = 'REQUEST_SENSORS'
export const RECEIVE_SENSORS = 'RECEIVE_SENSORS'

export const requestSensors = () => {
  return {
    type: REQUEST_SENSORS
  }
}

export const receiveSensors = (json) => {
  return {
    type: RECEIVE_SENSORS,
    sensors: json.sensors,
    receivedAt: Date.now()
  }
}

export const fetchSensors = () => {
  return dispatch => {
    dispatch(requestSensors())
    return fetch('/api/sensors')
      .then(response => response.json())
      .then(json => dispatch(receiveSensors(json)))
  }
}

const shouldFetchSensors = (state) => {
  const sensors = state.sensors
  return sensors && !sensors.isFetching
}

export const fetchSensorsIfNeeded = () => {
  return (dispatch, getState) => {
    if (shouldFetchSensors(getState())) {
      return dispatch(fetchSensors())
    } else {
      return Promise.resolve()
    }
  }
}
