//router for different components
import Vue from "vue";
import Router from "vue-router";
import Login from '@/views/login';
import Layout from '@/components/Layout.vue';
import Goods from '@/views/goods';
import Member from '@/views/member';
import Home from '@/views/homepage';
import Staff from '@/views/staff';
import Supplier from '@/views/supplier';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'layout',
            component: Layout,
            redirect: '/home',
            children: [
                {
                    path: '/home',
                    component: Home,
                    meta: {title: 'Home Page'}
                },
                {
                    path: '/member',
                    component: Member,
                    meta: {title: 'Members Management'}
                },
                {
                    path: '/supplier',
                    component: Supplier,
                    meta: {title: 'Venders Management'}
                },
                {
                    path: '/goods',
                    component: Goods,
                    meta: {title: 'Goods Management'}                    
                },
                {
                    path: '/staff',
                    component: Staff,
                    meta: {title: 'Staff Management'}
                }
            ]
        }
    ]
});
