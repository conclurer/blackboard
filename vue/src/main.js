import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Import Bootstrap
//import Bootstrap from 'bootstrap';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
//Vue.use(Bootstrap);
Vue.use(BootstrapVue);

//import i18n
import VueI18n from 'vue-i18n';
import messages from './lang';

Vue.use(VueI18n);
export const i18n = new VueI18n({
  locale: 'en',
  fallbacklocale: 'en',
  messages
});

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faPlus, 
  faUser,
  faUserCircle, 
  faBold, 
  faItalic, 
  faStrikethrough,
  faUnderline,
  faCode,
  faParagraph,
  faListUl,
  faListOl,
  faQuoteRight,
  faTerminal,
  faUndo,
  faRedo
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faPlus,
  faUser,
  faUserCircle, 
  faBold, 
  faItalic, 
  faStrikethrough,
  faUnderline,
  faCode,
  faParagraph,
  faListUl,
  faListOl,
  faQuoteRight,
  faTerminal,
  faUndo,
  faRedo
);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// Import ES6 style
import {VueMasonryPlugin} from 'vue-masonry';
Vue.use(VueMasonryPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
