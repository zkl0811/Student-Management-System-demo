import request from '@/utils/request.js';
export default {
    getList(){
        return request({
            url: `/supplier/list`,
            method: 'get'
        });
    },
    search(page, size, searchMap){
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },
    add(addSupplier){
        return request({
            url: `/supplier`,
            method: 'post',
            data: addSupplier
        });
    },
    getById(id){
        return request({
            url: `/supplier/${id}`,
            method: 'get'
        });
    },
    update(addSupplier){
        return request({
            url: `/supplier/${addSupplier.id}`,
            method: 'put',
            data: addSupplier
        });
    },
    deleteById(id){
        return request({
            url: `/supplier/${id}`,
            method: 'delete'
        });
    }
};