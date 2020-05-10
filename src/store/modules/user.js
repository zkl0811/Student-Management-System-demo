import authen from '@/utils/authentication.js';
import { login, getUserInfo, logout } from '@/api/login.js';

const user = {
    state: {
        token: authen.getToken(),
        user: authen.getUser()
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            authen.setToken(token);
        },
        SET_USER(state, user) {
            state.user = user;
            authen.setUser(user);
        },
    },
    actions: {
        //retrieve token and login
        Login({ commit }, form) {
            return new Promise((resolve, reject) => {
                login(form.username.trim(), form.password).then(res => {
                    //console.log(res);
                    commit('SET_TOKEN', res.data.data.token);
                   
                    resolve(res.data);
                }).catch(err => {
                    reject(err);
                });
            });

        },

        //retrieve userinfo by token
        GetUserInfo({commit,state}){
            return new Promise((resolve, reject)=>{
                getUserInfo(state.token).then(res=>{
                    commit('SET_USER', res.data.data);
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
            });
        },

        //logout
        Logout({commit, state}){
            return new Promise((resolve, reject)=>{
                logout(state.token).then(res=>{
                   commit('SET_TOKEN', null);
                   commit('SET_USER', null); 
                   authen.removeToken();
                   resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
            });
        }
    }
}

export default user;