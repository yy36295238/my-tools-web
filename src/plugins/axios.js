'use strict';

import Vue from 'vue';
import axios from 'axios';
import { Notice } from 'iview';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: baseUrl(),
  timeout: 10 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    console.error('request error', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    const headers = response.headers;
    if (headers['content-type'] === 'application/octet-stream') {
      return response;
    }
    if (response.data.code != 200) {
      Notice.error({
        title: response.data.message,
        desc: response.data.detailMsg ? response.data.detailMsg : '',
        duration: 10,
      });
      return Promise.reject(response.data);
    }
    return response;
  },
  function(error) {
    console.error('response error', error);
    Notice.error({
      title: '服务不可用',
    });
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
