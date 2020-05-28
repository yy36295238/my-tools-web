import Vue from 'vue';
import hljs from 'highlight.js'; //导入代码高亮文件
import 'highlight.js/styles/tomorrow.css'; //导入代码高亮样式,tomorrow,dracula,zenburn,androidstudio,rainbow

Vue.use(hljs);

import 'view-design/dist/styles/iview.css';

//自定义一个代码高亮指令
Vue.directive('highlight', function(el) {
  let highlight = el.querySelectorAll('pre code');
  highlight.forEach((block) => {
    hljs.highlightBlock(block);
  });
});
