import axios from '@/libs/api.request'


// params: {
//   id: 789
// }

export const getSettingsList = () => {

  // let params={
  //   page: page,
  //   size: size,
  // }
//  params=Object.assign(params, data)
  return axios.request({
    url: 'systemSetting/getList',
   // params:params,
    method: 'get'
  })
}

export const updateById = (params) => {

  const data=JSON.parse(JSON.stringify(params));
  // let params={
  //   page: page,
  //   size: size,
  // }
//  params=Object.assign(params, data)
  return axios.request({
    url: 'systemSetting/updateById',
    data,
    method: 'post'
  })
}


export const getSystemName = () => {

  // let params={
  //   page: page,
  //   size: size,
  // }
//  params=Object.assign(params, data)
  return axios.request({
    url: 'systemSetting/getSystemName',
   // params:params,
    method: 'get'
  })
}
