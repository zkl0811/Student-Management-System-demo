import router from './router.js';
import { getUserInfo } from './api/login.js';

router.beforeEach((to, from, next) => {
    //get token
    const token = localStorage.getItem('mxg-msm-token');
    //if false-> return to login 
    if (!token) {
        if (to.path !== '/login') {
            next({ path: '/login' });
        } else {
            //go to  from.path
            next();
        }
    } else {
        //if true-> |-- if request '/login', go to login page
        if (to.path === '/login') {
            next();
        } else {
            //|--if request others, |then if token.userdata ---> go to other pages
            const userInfo = localStorage.getItem('mxg-msm-user');
            if (userInfo) {
                next();
            } else {
                //| then if no token.usedadta --> go to login page
                getUserInfo(token).then(res=>{
                    if(res.data.flag){
                        localStorage.setItem('mxg-msm-user', JSON.stringify(res.data.data));
                        next();
                    }else{
                        next({path: '/login'});
                    }
                }); 
                
            }

        }
    }



});