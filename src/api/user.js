import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data})
}

export function getInfo(token) {
  return request({
    url: '/api/services/app/Profile/GetUserLoginInfo',
    method: 'get'
  })
}

export function logout() {
 
}

export function updateUserProfileTradingAccount(data) {
  return request({
    url: '/api/services/app/User/UpdateUserProfileTradingAccount',
    method: 'put',
    data
  })
}

