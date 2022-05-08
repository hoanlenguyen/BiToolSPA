import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/TokenAuth/AuthenticateAdmin',
    method: 'post',
    data: {
      userNameOrEmailAddress: data.username,
      password: data.password,
      tenant: data.tenant
    },
    config: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/services/app/Profile/GetUserLoginInfo',
    method: 'get'
  })
}

export function logout() {
  // return request({
  //   url: '/login/logout',
  //   method: 'post'
  // })
  return request()
}

export function updateUserProfileTradingAccount(data) {
  return request({
    url: '/api/services/app/User/UpdateUserProfileTradingAccount',
    method: 'put',
    data
  })
}

