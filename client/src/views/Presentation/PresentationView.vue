<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import NavbarDefault from "../..//examples/navbars/NavbarDefault.vue";
import ChooseTAPreference from "../LandingPages/RecommendationPage/ChooseTAPreference.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// sections
import PresentationCounter from "./Sections/PresentationCounter.vue";

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
import { useAuthStore } from "../../stores/index.js";

export default {
  computed: {
    isLoggedIn() {
      const authStore = useAuthStore();
      return authStore.isLoggedIn;
    },
  },
  mounted() {
    this.checkTokenOnLoad();
  },
  components: {
    ChooseTAPreference,
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    goToRecommend() {
      this.isModalOpen = true;
    },
    kakaoLogin() {
      const authStore = useAuthStore();
      const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;

      window.Kakao.Auth.login({
        scope: 'profile_nickname, account_email, gender',
        success: this.getKakaoAccount,
      });
      
    },

    getKakaoAccount() {
  const authStore = useAuthStore();

  window.Kakao.API.request({
    url: "/v2/user/me",
    success: async (res) => {
      const properties = res.properties; 
      const nickname = properties.nickname;
      const kakao_account = res.kakao_account;
      const gender = kakao_account.gender; 
      const email = kakao_account.email; 


      // authStore.loginWithKakao가 Promise를 반환하므로, 해당 Promise가 완료될 때까지 기다림
      await authStore.loginWithKakao(email)
        .then(() => {
          // post 요청이 완료된 후에 실행되는 로직
          if (!authStore.isLoggedIn) {
            // 처음 로그인하는 경우
            alert("첫 로그인 입니다! 환영해요");
            authStore.setUserInfo({ email, nickname, gender });
            this.$router.push({ name: 'getinformation' });
          } else {
            // 이미 로그인한 경우
            alert("로그인 완료");
            this.openModal();
          }

          authStore.setLoggedIn(true);
        })
        .catch((error) => {
          console.error('Error during login', error);
        });

      
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
        // 백엔드에서 유저정보 받기.
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
  <div>
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
      <div class="black-bg" v-if="isModalOpen" >
        <div id="modal">
          <ChooseTAPreference @closeModal="closeModal"/>
        </div>
      </div>
      <div class="margin col container">
        <div class="mx-auto position-relative left">
          <h1
            style="font-size: 100px"
            class="margin_bottom text-white"
            :style="{ display: 'inline-block; ' }"
          >
            일멍쉬멍
          </h1>
          <p class="lead text-white mt-3 mb-5" :style="{ fontWeight: '500' }">
            일도 하고 휴가도 즐기고!<br />
            워케이션을 위한 관광지와 업무 공간을 맞춤 추천해드려요!<br />
            설명설명<br />
            설명설명<br />
            설명설명<br />
          </p>
          <div>
            <MaterialButton
            variant="gradient"
            color="success"
            class="mt-2 mb-2"
            @click.prevent="openModal"
            v-if="!isLoggedIn">
            추천페이지
          </MaterialButton>
            <!-- <Button v-if="isLoggedIn" class="styled-button" @click="openModal"
              >추천페이지</Button
            > -->
            <MaterialButton
            variant="gradient"
            color="success"
            class="mt-2 mb-2"
            @click.prevent="kakaoLogin"
            v-if="isLoggedIn">
            추천페이지
          </MaterialButton>
            <!-- <Button v-if="!isLoggedIn" class="styled-button" @click="kakaoLogin"
              >추천페이지</Button
            > -->
          </div>
        </div>
        <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 right">
          <PresentationCounter />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.right {
  float: right;
}
.left {
  float: left;
}
.margin {
  margin-top: 170px;
}
.font_size40 {
  font-size: 1.2rem;
}
.margin_bottom {
  margin-bottom: 50px;
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
  margin: 0;
}
#modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.black-bg {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  padding: 20px;
  box-sizing: border-box;
  z-index: 1030;
}
</style>
