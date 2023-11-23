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
      const { kakao_email, nickname, gender } = this.userInfo;
    
      // gender를 boolean으로 변환
      const genderToSend = gender.toLowerCase() === 'male'; // 예시: 'male'이면 true, 'female'이면 false
    
      const userInfoToSend = {
        kakao_email,
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
    //이메일 받아오기 -> 로그인시작할때넣어서 확인용.
    getUserInfoByEmail(kakao_email) {
      axios
        .get(`/api/user`, {
          params: {
            kakao_email: kakao_email,
          },
        })
        .then((response) => {
          const userData = response.data.data; // 예제에서는 response.data 안에 data가 있어 가정
          this.setUserInfo(userData);
          console.log("사용자 정보를 성공적으로 가져왔습니다", userData);
        })
        .catch((error) => {
          console.error("사용자 정보를 가져오는 중 오류 발생", error.response);
        });
    },
  },
});
