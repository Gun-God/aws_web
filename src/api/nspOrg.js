import axios from '@/libs/api.request'

export const getOrgInfoByCode = (orgCode) => {
  return axios.request({
    url: 'org/getOrgInfoByCode',
    params: {
      orgCode: orgCode
    },
    method: 'get'
  })
}



export const getOrgDataList = (page, size) => {
  let params={
    page: page,
    size: size,
  }
  return axios.request({
    url: 'org/getList',
    params:params,
    method: 'get'
  })
}

export const insertOrg = (params) => {

  const data=JSON.parse(JSON.stringify(params));
  // let params={
  //   page: page,
  //   size: size,
  // }
//  params=Object.assign(params, data)
  return axios.request({
    url: 'org/insertOrg',
    data,
    method: 'post'
  })
}


export const deleteById = (id) => {
  let params={
    id: id
  }
  return axios.request({
    url: 'org/deleteById',
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
    url: 'org/updateById',
    data,
    method: 'post'
  })
}

export const selectAllOrg= () => {

  return axios.request({
    url: 'org/selectAllOrg',
    method: 'get'
  })
}



