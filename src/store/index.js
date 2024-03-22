import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userinfo: {},
        articles: [], //文章内容
        loginflag: false,
        messages: [],
        searchtopics: [],
        searcharticles: [],
        // 私人信息
        privateData: []
    },
    mutations: {
        usr_login(state, value) {
            state.userinfo = value
        },
        loginflag(state, value) {
            state.loginflag = value.flag
        },
        store_article(state, value) {
            state.articles = value
        },
        message(state, val) {
            state.messages = val
        },
        search_topic(state, val) {
            state.searchtopics = val
        },
        search_article(state, val) {
            state.searcharticles = val
        },
        private(state, val) {
            state.privateData = val
        }
    },
    actions: {},
    modules: {}
})