import axios from 'axios'

const ERROR_CODE = 0
const baseURL = '/'

axios.defaults.baseURL = baseURL

export const get = (url, params) => {
  return axios
    .get(url, { params })
    .then(res => {
      const serviceData = res.data
      if (serviceData.code === ERROR_CODE) {
        return serviceData.result
      }
    })
    .catch(error => {
      console.log(error)
    })
}
