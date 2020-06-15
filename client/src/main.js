import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Home from "./views/Home.vue";
import Account from "./views/Account.vue";
import Auctions from "./views/EditAuctions.vue";
import Auction from "./views/AuctionDetails.vue";
import addAuction from "./views/addAuction.vue";
import History from "./views/History.vue";
import Manager from "./views/AuctionManager.vue";
import Chat from "./views/Chat.vue";
import InfiniteLoading from 'vue-infinite-loading';

Vue.use(InfiniteLoading);
Vue.use(VueRouter);
Vue.config.productionTip = false

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/", component: Home },
  { path: "/account", component: Account },
  { path: "/myAuctions", component: Auctions },
  { path: "/auction/:id", name: "auction", component: Auction },
  { path: "/addAuction", component: addAuction },
  { path: "/history", component: History },
  { path: "/chat", component: Chat },
  { path: "/panel", component: Manager }
];

const router = new VueRouter({
  routes: routes,
  mode: "history"
})

new Vue({
  router: router,
  render: function (h) { return h(App) },
}).$mount('#app')
