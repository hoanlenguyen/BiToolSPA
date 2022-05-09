import request from '@/utils/request'

export function importCustomerScore(data) {
  return request({
    url: '/data/importCustomerScoreList',
    method: 'post',
    data
    })
}

export function getAdminScores() {
    return request({
      url: '/data/getAdminScores',
      method: 'get'
    })
  }