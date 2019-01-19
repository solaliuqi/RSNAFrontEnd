import request from '@/plugin/axios'

export function upImage (data) {
    return request({
        url: '/image/imageUpload.do',
        method: 'post',
        processData: false,
        contentType: false,
        dataType: 'json',
        data:data
    })
}

export function upModification (data) {
    return request({
        url: '/image/imageUpdate.do',
        method: 'post',
        contentType: 'application/json',
        data:data
    })
}

export function userRegister (data) {
    return request({
        url: '/user/register.do',
        method: 'get',
        params: data
    })
}
