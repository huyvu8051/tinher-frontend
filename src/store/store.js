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
        loginData: {},
        jwt: "",
        geoLocation: {}



    },
    mutations: {
        saveLoginData(state, data) {
            state.loginData = data;
            state.jwt = data.jwt;
        },
        saveGeoLocation(state, data) {
            state.geoLocation = {
                lat: data.latitude,
                lon: data.longitude
            };
        },


    }
})