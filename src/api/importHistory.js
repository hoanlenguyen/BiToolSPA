import request from '@/utils/request'

export function getPagingImportHistories(input) {
  return request({
    url: '/importHistory/paging',
    method: 'post',
    data: input
  })
}

export function getResource() {
  return request({
    url: '/importHistory/getResource',
    method: 'get'
  })
}

