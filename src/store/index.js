import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    fetched: false,
    text: 'Yupieeeeeeeeeeeeeeeeeee',
    title: 'App'
  },

  actions: {
    UPDATE: ({ commit }, { text }) => {
      commit('SET_TEXT', { text })
    },
    SET_TITLE: ({ commit }, { value }) => {
      commit('SET_TITLE', { value })
    }
  },

  mutations: {
    SET_TEXT: (state, { text }) => {
      state.text = text
    },
    SET_TITLE: (state, { value }) => {
      state.title = value
    }
  },

  getters: {}
})

export default store
