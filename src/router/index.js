import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: () =>
            import ('@/views/Index.vue'),
    },
    {
        path: '/login/:id',
        name: 'Login',
        component: () =>
            import ('@/views/Login.vue')
    },
    {
        path: '/edit',
        name: 'edit',
        beforeEnter: (to, from, next) => {
            const cookie = Cookies.get('usrinfo');
            if (cookie == null) {
                return next('/');
            }
            next();
        },
        component: () =>
            import ('@/views/Editor.vue')
    },
    {
        path: '/article',
        // beforeEnter: (to, from, next) => {
        //     const cookie = Cookies.get('usrinfo');
        //     if (cookie == null) {
        //         return next('/');
        //     }
        //     next();
        // },
        component: () =>
            import ('@/views/Article.vue')
    },
    {
        path: '/upload',
        beforeEnter: (to, from, next) => {
            const cookie = Cookies.get('usrinfo');
            if (cookie == null) {
                return next('/');
            }
            next();
        },
        component: () =>
            import ('@/views/Upload.vue')
    },
    {
        path: '/private',
        beforeEnter: (to, from, next) => {
            const cookie = Cookies.get('usrinfo');
            if (cookie == null) {
                return next('/');
            }
            next();
        },
        component: () =>
            import ('@/views/Private.vue')
    },
    {
        path: '/share/:id',
        component: () =>
            import ('@/views/Share.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router