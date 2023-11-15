// /src/store/index.js
import { defineStore, createPinia } from 'pinia';

// Pinia 인스턴스를 생성
const pinia = createPinia();
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
  }),
  actions: {
    login() {
      return new Promise((resolve, reject) => {
        const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;
        if (isKakaoAuthorized) {
          alert("로그인 상태입니다!");
          reject(new Error('Already logged in'));
        } else {
          window.Kakao.Auth.login({
            scope: "profile_image, account_email",
            success: (authObj) => {
              this.accessToken = authObj.access_token;
              resolve();
            },
            fail: (error) => {
              console.error('카카오 로그인 실패:', error);
              reject(error);
            },
          });
        }
      });
    },
    logout() {
      return new Promise((resolve, reject) => {
        window.Kakao.Auth.logout((res) => {
          console.log(res);
          this.accessToken = null;
          resolve();
        });
      });
    },
  },
});
export { pinia };