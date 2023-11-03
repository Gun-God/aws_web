import axios from '@/libs/api.request'

export const getPreCheckDataNewList = (orgCode) => {
  return axios.request({
    url: 'preCheck/getList',
    params: {
      orgCode: orgCode
    },
    method: 'get'
  })
}


export const getNowPreCheckData = () => {
  return axios.request({
    url: 'preCheck/getNowPreCheckData',
    method: 'get'
  })
}

export const getCarCountCurrent = () => {
  return axios.request({
    url: 'preCheck/getCarCountCurrent',
    method: 'get'
  })
}
export const getCarOverLoadCurrent = () => {
  return axios.request({
    url: 'preCheck/getCarOverLoadCurrent',
    method: 'get'
  })
}
export const getCarCountLast24H = () => {
  return axios.request({
    url: 'preCheck/getCarCountLast24H',
    method: 'get'
  })
}
export const getCarTypeCountCurrent = () => {
  return axios.request({
    url: 'preCheck/getCarTypeCountCurrent',
    method: 'get'
  })
}

// export const getCarTypeCountCurrent = () => {
//   return axios.request({
//     url: 'preCheck/getCarTypeCountCurrent',
//     method: 'get'
//   })
// }
