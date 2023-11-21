<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import NavbarDefault from "../..//examples/navbars/NavbarDefault.vue";
import ChooseTAPreference from "../LandingPages/RecommendationPage/ChooseTAPreference.vue";
import DefaultFooter from "../../examples/footers/FooterDefault.vue";
import Header from "../../examples/Header.vue";
import FilledInfoCard from "../../examples/cards/infoCards/FilledInfoCard.vue";

//Vue Material Kit 2 components
import MaterialSocialButton from "@/components/MaterialSocialButton.vue";

// sections
import PresentationCounter from "./Sections/PresentationCounter.vue";
import PresentationPages from "./Sections/PresentationPages.vue";

//images
import vueMkHeader from "@/assets/img/sea.jpg";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
});
onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});
</script>

<script>
import { useAuthStore } from '../../stores/index.js';

export default {
  computed: {
    isLoggedIn() {
      const authStore = useAuthStore();
      return authStore.isLoggedIn;
    },
  },
  mounted() {
    // 페이지 로드 시 토큰 확인 및 isLoggedin 반영
    this.checkTokenOnLoad();
  },
  data() {
    return {
      showChooseTAPreference: false,
    };
  },
  methods: {
    openModal() {
      this.showChooseTAPreference = true;
    },
    closeModal() {
      this.showChooseTAPreference = false;
    },
    goToRecommend() {
      this.showChooseTAPreference = true;
      // this.$router.push({ name: 'recommend' });
    },
    kakaoLogin() {
  const authStore = useAuthStore();

  const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;

  if (isKakaoAuthorized) {
  // 이미 로그인된 상태라면 처리
  alert("로그인 이미 된거심");
  authStore.setLoggedIn(true);

  if (authStore.isFirstLogin) {
    authStore.updateFirstLoginStatus(false);
    // 첫 로그인 시에만 mypage.vue로 이동
    this.$router.push({ name: 'editmyinformation' });
  } else {
    // 이미 로그인된 상태이지만 첫 로그인이 아닌 경우의 로직
    alert("로그인 완료");
    this.openModal();
  }
} else {
  // 로그인을 요청
  window.Kakao.Auth.login({
    scope: 'profile_nickname,account_email, gender, age_range',
    success: this.getKakaoAccount,
  });
}
},
    getKakaoAccount() {
      const authStore = useAuthStore();

      window.Kakao.API.request({
        url: '/v2/user/me',
        success: (res) => {
          const kakao_account = res.kakao_account;
          const nickname = kakao_account.profile_nickname;
          const gender = kakao_account.gender; // Corrected
          const age_range = kakao_account.age_range; // Corrected
          const email = kakao_account.account_email;

          // Set the login status and user info in the store
          authStore.setLoggedIn(true);
          authStore.setUserInfo({ nickname ,email, gender, age_range });
          if (authStore.isFirstLogin) {
            alert("첫 로그인 입니다! 환영해요");
            authStore.setIsFirstLogin(false); // 첫 로그인 후에는 상태 업데이트

            // 첫 로그인 시에만 mypage.vue로 이동
            this.$router.push({ name: 'editmyinformation' });
          }else{
            alert("로그인 완료")
            this.openModal();
          }

        },
        fail: (error) => {
          console.log(error);
        },
      });
    },
    checkTokenOnLoad() {
      const authStore = useAuthStore();
      const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;
      
      if (isKakaoAuthorized) {
        // 토큰이 있는 경우
        authStore.setLoggedIn(true);
      } else {
        // 토큰이 없는 경우
        authStore.setLoggedIn(false);
      }
    },

  },
};
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <div
    class="page-header min-vh-100"
    :style="`background-image: url(${vueMkHeader})`"
    loading="lazy"
  >
  <div class="black-bg" v-if="showChooseTAPreference" @click="closeModal">
    <div id="modal">
      <ChooseTAPreference />
    </div>
  </div>
      <div class=" margin col container">
        <div class="mx-auto position-relative left">
          
            <h1
            style="font-size:100px;"
            class="margin_bottom text-white"
            :style="{ display: 'inline-block; ' }"
          >
            일멍쉬멍
          </h1>
          <p class="lead text-white  mt-3 mb-5" :style="{ fontWeight: '500' }">
              일도 하고 휴가도 즐기고!<br>
              워케이션을 위한 관광지와 업무 공간을 맞춤 추천해드려요!<br>
              설명설명<br>
              설명설명<br>
              설명설명<br>
              
          </p>
          <div>
            <Button v-if="isLoggedIn" class="styled-button" @click="openModal">추천페이지</Button>
            <Button v-if="!isLoggedIn" class="styled-button" @click="kakaoLogin">추천페이지</Button>
          </div>
        </div>
        <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 right" >
          <PresentationCounter />
        </div>
      </div>
  </div>
</template>

<style>
  .right{
    float:right
  }
  .left{
    float:left
  }
  .margin{
    margin-top: 170px;
  }
  .font_size40{
    font-size : 1.2rem;
  }
  .margin_bottom{
    margin-bottom : 50px;
  }
  .styled-button {
    padding: 10px 20px;
    background-color: rgba(12, 222, 187, 0.873);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  body {
    margin : 0;
  }
  #modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .black-bg {
    width: 100%; height:100%;
    background: rgba(0,0,0,0.5);
    position: fixed; padding: 20px;
    box-sizing: border-box;
    z-index: 100;
  }
  .white-bg {
    width: 100%; background: white;
    border-radius: 8px;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
