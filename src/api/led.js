import axios from '@/libs/api.request'


// params: {
//   id: 789
// }

export const getLedList = (page, size) => {

  return axios.request({
    url: 'awsLed/getLedList',
    params: {
      page: page,
      size: size
    },
    method: 'get'
  })
}
