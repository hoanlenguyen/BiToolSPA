import request from '@/utils/request'
 
export function getCustomers(data) {
    return request({
      url: '/data/getCustomersBySP',
      method: 'get',
      params: data
    })
  }

export function assignCampaignToCustomers(data) {
    return request({
      url: '/data/assignCampaignToCustomers',
      method: 'post',
      data
    })
}