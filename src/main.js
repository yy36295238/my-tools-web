import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/iview.js';
import './plugins/highlight';
import axios from 'axios';

import '@/assets/css/global.css';

import tools from '@/utils/tools.js';

Vue.prototype.tools = tools;

Vue.config.productionTip = false;

function createdVue() {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
}

let env = process.env.NODE_ENV;
let path = '/config/config-' + env + '.json';
console.log('env:', env, path);

// 放在public文件夹下的静态文件需要通过绝对路径去获取
axios.get(path).then((res) => {
  console.log('config:', res.data);
  axios.defaults.baseURL = res.data.baseURL;
  createdVue();
  Vue.prototype.baseURL = res.data.baseURL;
});
