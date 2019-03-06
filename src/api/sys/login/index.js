import request from '@/plugin/axios'

export function AccountLogin(data) {
    return request({
        url: '/user/login.do',
        method: 'get',
        params: data
    })
}

export function AccountLogout(data) {
    return request({
        url: '/user/clearCookie.do',
        method: 'get',
        params:data
    })
}

export function userUpdate(data) {
    return request({
        url: '/userinfo/update.do',
        method: 'post',
        contentType: 'application/json',
        data:data
    })
}