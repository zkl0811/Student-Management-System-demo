import request from '@/utils/request.js';

export function getAllData (){
    return request ({
        url: '/allData',
        method: 'get'
    });
}