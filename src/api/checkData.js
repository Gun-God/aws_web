import axios from '@/libs/api.request'

export const getCheckDataList = (page, size) => {
  return axios.request({
    url: 'checkData/getCheckDataList',
    params: {
      page: page,
      size: size
    },
    method: 'get'
  })
}

