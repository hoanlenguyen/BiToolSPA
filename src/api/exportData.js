import request from '@/utils/request'
 
export function getCustomers(data) {
    return request({
      url: '/data/getCustomersBySP',
      method: 'get',
      params: data
    })
  }