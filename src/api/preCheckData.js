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
