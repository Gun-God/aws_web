import axios from '@/libs/api.request'


// params: {
//   id: 789
// }

export const getPreCheckDataHistoryList = (page, size,data) => {

  let params={
    page: page,
    size: size,
  }
  params=Object.assign(params, data)
  return axios.request({
    url: 'preCheck/getHistoryList',
    params:params,
    method: 'get'
  })
}
