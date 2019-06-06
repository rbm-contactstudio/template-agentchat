import Vue from 'vue';
import AppComponent from './components/App.vue';
import store from './store/store'
import router from './router'

window.$ = window.jQuery = require('jquery')
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap");

new Vue({
  router,
  store,
  render: h => h(AppComponent)
}).$mount('#app')
