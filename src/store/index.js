import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    currentUserData: [],
    initialLogin: false,
    initialLogout: false,
  },
  getters: {
    get_user_info: (state) => {
      return state.currentUserData;
    },

    get_initial_login: (state) => {
      return state.initialLogin;
    },
    get_initial_logout: (state) => {
      return state.initialLogout;
    },
  },
  mutations: {
    SET_USER_INFO(state, val) {
      state.currentUserData = val;
    },

    SET_INITIAL_LOGIN(state, val) {
      state.initialLogin = val;
    },

    SET_INITIAL_LOGOUT(state, val) {
      state.initialLogout = val;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()],
});
