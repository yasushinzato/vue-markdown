import 'shitajicss/dist/shitaji.min.css';
import './scss/style.scss';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import '../nodemodules/github-markdown-css/github-markdown.css'
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})
