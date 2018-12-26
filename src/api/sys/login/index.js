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
