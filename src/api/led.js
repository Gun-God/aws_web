import axios from '@/libs/api.request'


// params: {
//   id: 789
// }
export const getLedList = (page, size,data) => {
  
  let params={
    page: page,
    size: size,
  }
  params=Object.assign(params, data)
  return axios.request({
    url: 'awsLed/getLedList',
    params: params,
    method: 'get'
  })
}
