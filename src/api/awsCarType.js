import axios from '@/libs/api.request'

export const getAwsCarTypeList = () => {
  return axios.request({
    url: 'awsCarType/getList',
    method: 'get'
  })
}
