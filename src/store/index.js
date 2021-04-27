import state from './state'
import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'
import { createStore, createLogger } from 'vuex'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : ''
})
