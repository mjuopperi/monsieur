export const formatTemperature = temperature => (temperature / 1000).toFixed(2)

const postHeaders = new Headers()
postHeaders.append('Content-Type', 'application/json')
export const post = (url, data) => {
  return fetch(url, {
    method: 'POST',
    headers: postHeaders,
    body: JSON.stringify(data)
  })
}

