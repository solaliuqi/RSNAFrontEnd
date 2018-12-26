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