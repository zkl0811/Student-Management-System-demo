import router from './router.js';
import store from '@/store';

router.beforeEach((to, from, next) => {
    //get token
    const token = store.state.user.token;
    //console.log(token);
    //if false-> return to login 
    if (!token) {
        if (to.path !== '/login') {
            next({ path: '/login' });
        } else {
            //go to  to.path
            next();
        }
    } else {
        //if true-> |-- if request '/login', go to login page
        if (to.path === '/login') {
            next();
        } else {
            //|--if request others, |then if token.userdata ---> go to other pages
            const userInfo = store.state.user.user;
            if (userInfo) {
                next();
            } else {
                console.log('no info');
                //| then if no token.usedadta --> go to login page
                store.dispatch('GetUserInfo').then(res=>{
                    if(res.flag){
                        next();
                    }else{
                        next({ path: '/login' });
                    }
                }).catch(err=>{});                
            }

        }
    }



});