import axios from '@/libs/api.request'





export const getScanDataList = (page, size) => {
  let params={
    page: page,
    size: size,
  }
  return axios.request({
    url: 'scan/getList',
    params:params,
    method: 'get'
  })
}

export const insertScan = (params) => {

  const data=JSON.parse(JSON.stringify(params));
  // let params={
  //   page: page,
  //   size: size,
  // }
//  params=Object.assign(params, data)
  return axios.request({
    url: 'scan/insertScan',
    data,
    method: 'post'
  })
}


export const deleteById = (id) => {
  let params={
    id: id
  }
  return axios.request({
    url: 'scan/deleteById',
    params:params,
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
    url: 'scan/updateById',
    data,
    method: 'post'
  })
}

export const selectAllCamera = () => {
 
  return axios.request({
    url: 'scan/selectAllCamera',
    method: 'get'
  })
}


export const selectAllPreviewDevice = () => {
 
  return axios.request({
    url: 'scan/selectAllPreviewDevice',
    method: 'get'
  })
}




