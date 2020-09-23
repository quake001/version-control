import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}

export function regist(data) {
  return request({
    url: '/user',
    method: 'post',
    data: {
      id:data.username,
      username: data.username,
      password: data.password,
      access_token: "53cfe4fc-fc7e-4b3c-b8df-6522c3840ec6"
    }
  }) 
}
export function getInfo() {
  return request({
    url: '/sys/me',
    method: 'post'
  })
}

export function getPhoneCode(data) {
  return request({
    url: '/sms/dosendMsg',
    method: 'post',
    data: {
      phone: data
    }
  })
}
