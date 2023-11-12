<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import NavbarDefault from "../..//examples/navbars/NavbarDefault.vue";
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
export default {
  data() {
    return {
    };
  },
  methods: {
    goToContactUs() {
      this.$router.push({ name: 'recommend' });
    },
    kakaoLogin() {
      const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;
      if (isKakaoAuthorized) {
        this.goToContactUs();
      } else {
        window.Kakao.Auth.login({
          scope: "profile_image, account_email",
          success: this.getKakaoAccount,
        });
      }
    },
    getKakaoAccount() {
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (res) => {
          const kakao_account = res.kakao_account;
          const nickname = kakao_account.profile.nickname;
          const email = kakao_account.email;
          console.log("nickname", nickname);
          console.log("email", email);

          // Set the login status to true
          this.isLoggedIn = true;
          this.$emit('kakaoLoginClicked');

          // 로그인 처리 구현
          alert("로그인 성공!");
        },
        fail: (error) => {
          console.log(error);
        },
      });
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
      <div class=" margin col container">
        <div class="text-center mx-auto position-relative left">
          
            <h1
            style="font-size:100px;"
            class="margin_bottom text-white"
            :style="{ display: 'inline-block; ' }"
          >
            일멍쉬멍
          </h1>
          <p class="lead text-white px-5 mt-3 mb-5" :style="{ fontWeight: '500' }">
              일도 하고 휴가도 즐기고!<br>
              워케이션을 위한 관광지와 업무 공간을 맞춤 추천해드려요!<br>
              설명설명<br>
              설명설명<br>
              설명설명<br>
              
          </p>
          <div >
            <Button class="styled-button" @click="kakaoLogin">추천페이지</Button>
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
</style>