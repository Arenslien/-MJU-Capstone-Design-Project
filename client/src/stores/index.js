import { defineStore } from "pinia";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import axios from "axios";
export const useAppStore = defineStore("storeId", {
  state: () => ({
    bootstrap,
  }),
});
export const useAuthStore = defineStore("auth", {
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
    },
    logout() {
      window.Kakao.Auth.logout(() => {
        this.resetAuth();
      });
    },
    updateFirstLoginStatus(status) {
      this.isFirstLogin = status;
    },
    sendUserInfoToBackend() {
      const { email, nickname, gender } = this.userInfo;

      const userInfoToSend = {
        kakao_email: email,
        nickname: nickname,
        gender: gender == "male" ? true : false,
      };

      axios
        .post("http://localhost:8080/api/auth/signup", userInfoToSend)
        .then((response) => {
          console.log("User info sent to backend successfully", response.data);
          // 이후 필요한 처리를 수행할 수 있습니다.
        })
        .catch((error) => {
          console.error("Error sending user info to backend", error);
        });
    },
  },
});
