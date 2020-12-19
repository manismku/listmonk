import Vue from 'vue';
import Buefy from 'buefy';
import humps from 'humps';
import VueI18n from 'vue-i18n';

import App from './App.vue';
import router from './router';
import store from './store';
import * as api from './api';
import utils from './utils';
import { models } from './constants';
import en from './en';

// Internationalisation.
Vue.use(VueI18n);

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
});

i18n.setLocaleMessage('en', en);


Vue.use(Buefy, {});
Vue.config.productionTip = false;

// Custom global elements.
Vue.prototype.$api = api;
Vue.prototype.$utils = utils;

Vue.prototype.$reloadServerConfig = () => {
  // Get the config.js <script> tag, remove it, and re-add it.
  let s = document.querySelector('#server-config');
  const url = s.getAttribute('src');
  s.remove();

  s = document.createElement('script');
  s.setAttribute('src', url);
  s.setAttribute('id', 'server-config');
  s.onload = () => {
    store.commit('setModelResponse',
      { model: models.serverConfig, data: humps.camelizeKeys(window.CONFIG) });
  };
  document.body.appendChild(s);
};

// window.CONFIG is loaded from /api/config.js directly in a <script> tag.
if (window.CONFIG) {
  store.commit('setModelResponse',
    { model: models.serverConfig, data: humps.camelizeKeys(window.CONFIG) });
}

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
