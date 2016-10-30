export default function SetTitle(Vue, options) {
  Vue.prototype.setTitle = function (value) {
    this.$store.dispatch('SET_TITLE', { value })
    if (!process.env.VUE_ENV) {
      document.querySelector('title').innerHTML = value
    }
  }
}