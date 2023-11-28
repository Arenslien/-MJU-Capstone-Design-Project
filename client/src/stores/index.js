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
    isLoggedIn: null,
    userInfo: null,
  }),
  actions: {
    setLoggedIn(status) {
      this.isLoggedIn = status;
    },
    setUserInfo(user) {
      // Check if user object has kakao_email property
      if ('kakao_email' in user) {
        // Rename kakao_email to email
        user.email = user.kakao_email;
        delete user.kakao_email; 
      }
    
      // Check if user object has gender property
      if ('gender' in user) {
        user.gender = user.gender === true ? 'male' : 'female';
      }
    
      this.userInfo = user;
    },
    
    
    resetAuth() {
      this.isLoggedIn = false;
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
    
      // gender를 boolean으로 변환
      const genderToSend = gender.toLowerCase() === 'male'; // 예시: 'male'이면 true, 'female'이면 false
    
      const userInfoToSend = {
        email,
        nickname,
        gender: genderToSend,
      };
    
      axios
        .post("http://localhost:8080/api/auth/signup", userInfoToSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log("사용자 정보가 성공적으로 백엔드로 전송되었습니다", response.data);
          // 이후 필요한 처리를 수행할 수 있습니다.
        })
        .catch((error) => {
          console.error("사용자 정보를 백엔드로 전송하는 중 오류 발생", error.response);
          // 에러 응답에 대한 더 자세한 정보를 로깅
        });
    },
    loginWithKakao(email1) {
      
      const userInfoToSend = {
        email: email1,
      };
    
      axios
        .post('http://localhost:8080/api/auth/login', userInfoToSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          const { res, message, data } = response.data;
          if (res) {
            // User already exists
            data.email = email1;
            this.setUserInfo(data);
            console.log(data);
            this.isLoggedIn = true;
            console.log(this.isLoggedIn);
          } else {
            // User does not exist
            this.isLoggedIn = false;
          }
        })
        .catch((error) => {
          console.error('Error during login', error);
        });
    },
    
    
  },
});