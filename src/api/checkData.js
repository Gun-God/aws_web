import axios from '@/libs/api.request'

export const getCheckDataList = (page, size,data) => {
  
  let params={
    page: page,
    size: size,
  }
  params=Object.assign(params, data)
  return axios.request({
    url: 'checkData/getCheckDataList',
    params: params,
    method: 'get'
  })
}

