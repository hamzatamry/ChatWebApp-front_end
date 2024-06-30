import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

export default {
  state() {
    return {
      userId: null,
      token: null,
      email: null,
      isAuthenticated: null
      //tokenExpiration: null //i was thinking about adding a  refresh token
    }
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}