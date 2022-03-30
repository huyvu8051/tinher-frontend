import axios from 'axios'
import store from '@/store/store'
import EventBus from '@/EventBus'


export default () => {

  var instance = axios.create({
    baseURL: "http://localhost:8081",
    headers: {
      Authorization: "Bearer " + `${store.state.loginData.jwt}`,
    }
  });

  instance.interceptors.request.use((request) => {
    
    EventBus.$emit("api-loading", true);
    return request;

  }, (error) => {
    EventBus.$emit("api-loading", false);
    return Promise.reject(error);

  });

  instance.interceptors.response.use(response => {

    EventBus.$emit("api-loading", false);
    return response;
  }, err => {

    EventBus.$emit("api-loading", false);
    
    EventBus.$emit("nofication", {
      message: err.response.data,
      status: "error",
    });

    return Promise.reject(err);

  })




  return instance;
}