import { defineStore } from "pinia";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
export const useAppStore = defineStore("storeId", {
  state: () => ({
    bootstrap,
  }),
});
export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userInfo: null,
  }),
  actions: {
    setLoggedIn(status) {
      this.isLoggedIn = status;
    },
    setUserInfo(user) {
      this.userInfo = user;
    },
    resetAuth() {
      this.isLoggedIn = false;
      this.userInfo = null;
    },
    logout() {
      window.Kakao.Auth.logout(() => {
        this.resetAuth();
      });
    },
  },
});