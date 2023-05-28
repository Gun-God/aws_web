import axios from '@/libs/api.request'

export const getCarNoDataList = (page, size,data) => {
  
  let params={
    page: page,
    size: size,
  }
  params=Object.assign(params, data)
  return axios.request({
    url: 'carNo/getCarNoDataList',
    params: params,
    method: 'get'
  })
}

