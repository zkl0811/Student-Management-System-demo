import request from '@/utils/request.js';
export default {
    search(page, size, searchMap){
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },

    add(addGoods){
        return request({
            url: `/goods`,
            method: 'post',
            data: addGoods
        });
    },

    getById(id){
        return request({
            url: `/goods/${id}`,
            method: 'get'
        });
    },
    update(addGoods){
        return request({
            url: `/goods/${addGoods.id}`,
            method: 'put',
            data: addGoods
        });
    },

    deleteById(id){
        return request({
            url: `/goods/${id}`,
            method: 'delete',
        });
    }
};