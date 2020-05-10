//customize axios
import axios from 'axios';
import { Loading, Message } from 'element-ui';

const loading = {
    loadingObj: null,//Loading instance
    open() {
        if(this.loadingObj === null){
            this.loadingObj = Loading.service({
                target: '.main',
                text: 'Loading...',
                background: 'rgba(0,0,0,0.3)'
            });
        }
        
    },
    close() {
        if (this.loadingObj !== null) {
            this.loadingObj.close();
            this.loadingObj = null;
        }

    }
}

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,

});

//request interceptor
request.interceptors.request.use(config => {
    loading.open();
    return config
}, err => {
    loading.close();
    Message({
        duration: 5000,
        message: 'Server Error',
        type: 'error'
    });
    return Promise.reject(err);
});

//response interceptors
request.interceptors.response.use(res => {
    loading.close();
    
    //deal response error
    if(res.data.code !== 2000){
       //error message
        Message({
        duration: 5000,
        message: 'Server Error',
        type: 'error'
        });
    }

    return res;
}, err => {
    loading.close();
    Message({
        message: err.message,
        type: 'error',
        duration: 5000
    });
    return Promise.reject(err);
});

export default request;