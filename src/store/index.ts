import Vue from "vue";
import Vuex from "vuex";
import authModule from "./modules/auth";
import connectionModule from "./modules/connection";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: authModule,
    connection: connectionModule
  }
});