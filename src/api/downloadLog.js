import axios from '@/libs/api.request'

export const getDownloadListByUser = () => {
    return axios.request({
      url: 'awsDownloadLog/getDownloadListByUser',
      method: 'get'
    })
  }
  

  export const getnewDownload = (downloadId) => {
    return axios.request({
      url: 'awsDownloadLog/getnewDownload',
      params:{
        downloadId:downloadId
      },
      method: 'get'
    })
  }
  