import request from '@/utils/request.js';

export default {
    getList(){
        return request({
            url: '/member/list',
            method: 'get'
        });   
    },
    //siez-> how many data display on each page
    //searchMap-> condition
    search(page, size ,searchMap){
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },

    add(addMember){
        return request({
            url: '/member',
            method: 'post',
            data: addMember
        });
    },
    getById(id){
        return request({
            url: `/member/${id}`,
            method: 'get'

        });
    },
    update(addMember){
        return request({
            url: `/member/${addMember.id}`,
            method: 'put',
            data: addMember
        });
    },
    deleteById(id){
        return request({
            url: `/member/${id}`,
            method: 'delete'
        });
    }
}