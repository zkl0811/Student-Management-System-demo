import request from '@/utils/request.js';

export default {

    search(page, size, searchMap){
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },

    add(addStaff){
        return request({
            url: `/staff`,
            method: 'post',
            data: addStaff
        });
    },

    getById(id){
        return request({
            url: `/staff/${id}`,
            method: 'get'
        });
    },

    update(addStaff){
        return request({
            url: `/staff/${addStaff.id}`,
            method: 'put',
            data: addStaff
        });
    },

    deleteById(id){
        return request({
            url: `/staff/${id}`,
            method: 'delete'
        });
    }
};