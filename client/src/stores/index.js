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
    isFirstLogin: true, // 새로운 속성 추가
    userInfo: null,
  }),
  actions: {
    setLoggedIn(status) {
      this.isLoggedIn = status;
      if (status) {
        this.isFirstLogin = false;
      }
    },
    setUserInfo(user) {
      this.userInfo = user;
    },
    resetAuth() {
      this.isLoggedIn = false;
      this.isFirstLogin = true;
      this.userInfo = null;
    },
    logout() {
      window.Kakao.Auth.logout(() => {
        this.resetAuth();
      });
    },
  },
});