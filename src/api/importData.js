import request from '@/utils/request'

export function importCustomerScore(input) {
  return request({
    url: '/data/importCustomerScore',
    method: 'post',
    data: input,
    headers: {'Content-Type': 'multipart/form-data'}
    })
}

export function compareCustomerMobiles(input) {
  return request({
    url: '/data/compareCustomerMobiles',
    method: 'post',
    data: input,
    headers: {'Content-Type': 'multipart/form-data'}
    })
}


export function getAdminScores() {
    return request({
      url: '/data/getAdminScores',
      method: 'get'
    })
  }

  export function getAdminCampaigns() {
    return request({
      url: '/data/getAdminCampaigns',
      method: 'get'
    })
  }