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


export const addCheckData = (params) => {

  // const data=JSON.parse(JSON.stringify(params));
  // let params={
  //   page: page,
  //   size: size,
  // }
//  params=Object.assign(params, data)
const data=params;
  return axios.request({
    url: 'checkData/addCheck',
    data,
    method: 'post'
  })
}


// getCheckList
export const getcheckDataNewList = (checkOrgCode) => {
  return axios.request({
    url: 'checkData/getCheckList',
    params: {
      orgCode: checkOrgCode
    },
    method: 'get'
  })
}
