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


export const exportPreCheckDataHistoryList = (page, size,data) => {

  let params={
    page: page,
    size: size,
  }
  params=Object.assign(params, data)
  return axios.request({
    url: 'preCheck/exportPerCheckDataHistory',
    params:params,
    method: 'get'
  })
}


export const exportPreCheckDataHistoryListImg = (page, size,data) => {

  let params={
    page: page,
    size: size,
  }
  params=Object.assign(params, data)
  return axios.request({
    url: 'preCheck/exportPerCheckDataHistoryImg',
    params:params,
    method: 'get'
  })
}



