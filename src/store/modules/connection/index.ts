import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

export default {
  state() {
    return {
      connectionId: null,
      userId: null
    }
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}