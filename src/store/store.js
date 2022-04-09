import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    plugins: [
        createPersistedState()
    ],
    state: {
        loginData: null,
        jwt: ""



    },
    mutations: {
        saveLoginData(state, data) {
            state.loginData = data;
            state.jwt = data.jwt;
        },


    }
})